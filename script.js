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
  {
    q: "Which programming language is known for web development?",
    a: "javascript",
    choices: ["python", "java", "javascript", "c++"],
    points: 2,
    type: "mcq"
  },
  {
    q: "What does URL stand for?",
    a: "uniform resource locator",
    points: 2,
    type: "text"
  },
  {
    q: "What does RAM stand for?",
    a: "random access memory",
    points: 2,
    type: "text"
  },
  {
    q: "Which of these is an operating system?",
    a: "windows",
    choices: ["linux", "macos", "windows", "android"],
    points: 2,
    type: "mcq"
  },
  {
    q: "Is HTML a programming language?",
    a: "no",
    choices: ["yes", "no"],
    points: 1,
    type: "mcq"
  },
  {
    q: "What is the most common type of computer storage used today?",
    a: "ssd",
    choices: ["hdd", "ssd", "floppy disk", "tape drive"],
    points: 2,
    type: "mcq"
  },
  {
    q: "Which key is used to open the start menu on Windows?",
    a: "windows",
    points: 1,
    type: "text"
  },
  {
    q: "Who invented the World Wide Web?",
    a: "tim berners-lee",
    points: 2,
    type: "text"
  }
];

let current = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const finalScore = document.getElementById("final-score");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

function startTimer() {
  timeLeft = 10;
  timerDisplay.textContent = `⏳ Time left: ${timeLeft}s`;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏳ Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswer(true);
    }
  }, 1000);
}

function updateProgressBar() {
  const percent = (current / questions.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function loadQuestion() {
  const q = questions[current];
  questionText.textContent = q.q;
  answerInput.style.display = "none";

  quizBox.classList.remove("fade");
  void quizBox.offsetWidth;
  quizBox.classList.add("fade");

  const existingMCQs = document.querySelectorAll(".mcq-option");
  existingMCQs.forEach(el => el.remove());

  if (q.type === "text") {
    answerInput.style.display = "block";
    answerInput.value = "";
  } else if (q.type === "mcq") {
    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "mcq-option";
      btn.textContent = choice;
      btn.onclick = () => {
        answerInput.value = choice;
        submitAnswer();
      };
      quizBox.insertBefore(btn, timerDisplay);
    });
  }

  startTimer();
  updateProgressBar();
}

function submitAnswer(auto = false) {
  clearInterval(timer);
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correct = questions[current].a;
  let isCorrect = false;

  if (Array.isArray(correct)) {
    isCorrect = correct.includes(userAnswer);
  } else {
    isCorrect = userAnswer === correct;
  }

  if (isCorrect) {
    score += questions[current].points;
    correctSound?.play();
  } else {
    wrongSound?.play();
  }

  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    progressBar.style.width = `100%`;
    quizBox.style.display = "none";
    resultBox.style.display = "block";
    finalScore.textContent = `${score} out of ${questions.reduce((a, q) => a + q.points, 0)}`;
  }
}

function restartQuiz() {
  current = 0;
  score = 0;
  quizBox.style.display = "block";
  resultBox.style.display = "none";
  loadQuestion();
}

window.onload = () => {
  loadQuestion();
  updateProgressBar();
};
