const questions = [
    { q: "What does CPU stand for?", a: "central processing unit", points: 2, type: "text" },
    { q: "Which key capitalizes letters?", a: ["shift", "capslock"], points: 2, type: "text" },
    { q: "What does HTML stand for?", a: "hypertext markup language", points: 2, type: "text" },
    {
      q: "What does GPU stand for?",
      a: "graphics processing unit",
      choices: ["graphical processing unit", "graphics processor unit", "graphics processing unit", "graphic performance unit"],
      points: 2,
      type: "mcq"
    },
    {
      q: "Is ten greater than 20?",
      a: "no",
      choices: ["yes", "no"],
      points: 1,
      type: "mcq"
    },
    { q: "What is the capital of France?", a: "paris", points: 1, type: "text" },
    {
      q: "Which one is a programming language?",
      a: "javascript",
      choices: ["html", "css", "javascript", "photoshop"],
      points: 2,
      type: "mcq"
    },
    { q: "What number comes after 99?", a: "100", points: 1, type: "text" },
    {
      q: "Which of these is a fruit?",
      a: "banana",
      choices: ["carrot", "broccoli", "banana", "potato"],
      points: 1,
      type: "mcq"
    },
    { q: "What does RAM stand for?", a: "random access memory", points: 2, type: "text" },
    {
      q: "Which animal is known as man's best friend?",
      a: "dog",
      choices: ["cat", "dog", "horse", "parrot"],
      points: 1,
      type: "mcq"
    },
    { q: "What does URL stand for?", a: "uniform resource locator", points: 2, type: "text" },
    {
      q: "Which planet is known as the Red Planet?",
      a: "mars",
      choices: ["earth", "mars", "jupiter", "venus"],
      points: 1,
      type: "mcq"
    },
    { q: "How many continents are there?", a: "7", points: 1, type: "text" },
    {
      q: "Which language is primarily used for styling web pages?",
      a: "css",
      choices: ["html", "css", "javascript", "python"],
      points: 2,
      type: "mcq"
    },
    { q: "What is the boiling point of water in Celsius?", a: "100", points: 1, type: "text" },
    {
      q: "Which gas do plants use to make food?",
      a: "carbon dioxide",
      choices: ["oxygen", "hydrogen", "carbon dioxide", "nitrogen"],
      points: 1,
      type: "mcq"
    },
    { q: "What is 9 multiplied by 6?", a: "54", points: 1, type: "text" },
    {
      q: "Which is the largest ocean on Earth?",
      a: "pacific",
      choices: ["atlantic", "indian", "arctic", "pacific"],
      points: 1,
      type: "mcq"
    },
    { q: "What is the chemical symbol for water?", a: "h2o", points: 1, type: "text" }
  ];
  
  let current = 0;
  let score = 0;
  let timer;
  let timeLeft = 10;
  let user = "";
  
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const finalScore = document.getElementById("final-score");
  const quizBox = document.getElementById("quiz-box");
  const resultBox = document.getElementById("result-box");
  const timerDisplay = document.getElementById("timer");
  const progressBar = document.getElementById("progress-bar");
  const correctSound = document.getElementById("correct-sound");
  const wrongSound = document.getElementById("wrong-sound");
  
  function startQuiz() {
    user = document.getElementById("username").value.trim();
    if (!user) {
      alert("Please enter your name first.");
      return;
    }
    localStorage.setItem("quizUser", user);
    document.getElementById("feedback-user").value = user;
  
    document.getElementById("name-box").style.display = "none";
    quizBox.style.display = "block";
    loadQuestion();
  }
  
  function startTimer() {
  timeLeft = 10;
  const timerBar = document.getElementById("timer-bar");
  timerBar.style.width = "100%";
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerBar.style.width = `${(timeLeft / 10) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswer(true); // Auto-submit when time runs out
    }
  }, 1000);
}

function handleEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default form submission
    document.getElementById("submit-button").click();
  }
}

function loadQuestion() {
  const q = questions[current];
  questionText.textContent = q.q;
  answerInput.style.display = q.type === "text" ? "block" : "none";
  answerInput.value = "";

  // Remove existing MCQ options
  const existingMCQs = document.querySelectorAll(".mcq-option");
  existingMCQs.forEach(el => el.remove());

  // Add MCQ options if applicable
  if (q.type === "mcq") {
    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "mcq-option";
      btn.textContent = choice;
      btn.onclick = () => {
        answerInput.value = choice;
        submitAnswer();
      };
      quizBox.insertBefore(btn, document.getElementById("timer-bar-container"));
    });
  }

  // Reattach "keypress" event listener for the "Enter" key
  answerInput.removeEventListener("keypress", handleEnter);
  answerInput.addEventListener("keypress", handleEnter);

  startTimer();
  updateProgressBar(); // Update progress bar here
}
  
  function submitAnswer(auto = false) {
  clearInterval(timer);
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correct = questions[current].a;
  const isCorrect = Array.isArray(correct) ? correct.includes(userAnswer) : userAnswer === correct;

  if (isCorrect) {
    score += questions[current].points;
    correctSound?.play(); // Play correct sound
  } else {
    wrongSound?.play(); // Play wrong sound
  }

  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    progressBar.style.width = `100%`; // Ensure progress bar is full at the end
    quizBox.style.display = "none";
    resultBox.style.display = "block";
    finalScore.textContent = `Here's your result, ${user}: ${score} out of ${questions.reduce((a, q) => a + q.points, 0)}`;
    saveProgress();
  }
  updateProgressBar(); // Update progress bar after submitting an answer
}
  
  function saveProgress() {
    const past = JSON.parse(localStorage.getItem("quizProgress") || "[]");
    past.push({ user, score, date: new Date().toLocaleString() });
    localStorage.setItem("quizProgress", JSON.stringify(past));
  }
  
  function restartQuiz() {
    current = 0;
    score = 0;
    quizBox.style.display = "block";
    resultBox.style.display = "none";
    loadQuestion();
  }
  
  function showProgress() {
    resultBox.style.display = "none";
    const list = document.getElementById("progress-list");
    list.innerHTML = "";
    const past = JSON.parse(localStorage.getItem("quizProgress") || "[]");
    past.filter(p => p.user === user).forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date}: ${entry.score}`;
      list.appendChild(li);
    });
    document.getElementById("progress-box").style.display = "block";
  }
  
  function closeProgress() {
    document.getElementById("progress-box").style.display = "none";
    resultBox.style.display = "block";
  }
  
  function openFeedback() {
    resultBox.style.display = "none";
    document.getElementById("feedback-user").value = user;
    document.getElementById("feedback-box").style.display = "block";
  }
  
  function closeFeedback() {
    document.getElementById("feedback-box").style.display = "none";
    resultBox.style.display = "block";
  }
  
  function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const progress = ((current + 1) / questions.length) * 100; // Calculate progress percentage
    progressBar.style.width = `${progress}%`; // Update progress bar width
}

  window.onload = () => {
    if (localStorage.getItem("quizUser")) {
      user = localStorage.getItem("quizUser");
      document.getElementById("feedback-user").value = user;
    }
  };
