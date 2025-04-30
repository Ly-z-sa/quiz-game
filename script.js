const questions = [/* same questions as before */];

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
  const usernameInput = document.getElementById("username");
  user = usernameInput.value.trim();
  if (!user) {
    alert("Please enter your name.");
    return;
  }

  document.getElementById("name-box").style.display = "none";
  quizBox.style.display = "block";
  loadQuestion();
  updateProgressBar();
}

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

  document.querySelectorAll(".mcq-option").forEach(el => el.remove());

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
  let isCorrect = Array.isArray(correct) ? correct.includes(userAnswer) : userAnswer === correct;

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
    quizBox.style.display = "none";
    resultBox.style.display = "block";
    progressBar.style.width = "100%";
    const total = questions.reduce((sum, q) => sum + q.points, 0);
    finalScore.textContent = `${user}, you scored ${score} out of ${total}`;
    saveProgress(user, score, total);
  }
}

function restartQuiz() {
  current = 0;
  score = 0;
  quizBox.style.display = "block";
  resultBox.style.display = "none";
  loadQuestion();
}

function saveProgress(name, score, total) {
  const progress = JSON.parse(localStorage.getItem("quizProgress") || "[]");
  progress.push({ name, score, total, date: new Date().toLocaleString() });
  localStorage.setItem("quizProgress", JSON.stringify(progress));
}

function showProgress() {
  resultBox.style.display = "none";
  const progress = JSON.parse(localStorage.getItem("quizProgress") || "[]");
  const list = document.getElementById("progress-list");
  list.innerHTML = "";

  if (progress.length === 0) {
    list.innerHTML = "<li>No progress recorded yet.</li>";
  } else {
    progress.forEach(entry => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} scored ${entry.score}/${entry.total} on ${entry.date}`;
      list.appendChild(item);
    });
  }

  document.getElementById("progress-box").style.display = "block";
}

function closeProgress() {
  document.getElementById("progress-box").style.display = "none";
  resultBox.style.display = "block";
}

function openFeedback() {
  document.getElementById("feedback-box").style.display = "block";
  resultBox.style.display = "none";
}

function closeFeedback() {
  document.getElementById("feedback-box").style.display = "none";
  resultBox.style.display = "block";
}

function submitFeedback() {
  const text = document.getElementById("feedback-text").value.trim();
  if (!text) {
    alert("Please write something!");
    return;
  }
  const feedback = JSON.parse(localStorage.getItem("quizFeedback") || "[]");
  feedback.push({ user, text, date: new Date().toLocaleString() });
  localStorage.setItem("quizFeedback", JSON.stringify(feedback));
  alert("Thanks for your feedback!");
  document.getElementById("feedback-text").value = "";
  closeFeedback();
}

window.onload = () => {
  // Wait for user name before starting
};
