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

const timerDisplay = document.createElement("p");
timerDisplay.id = "timer";
quizBox.insertBefore(timerDisplay, answerInput);

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

function loadQuestion() {
  const q = questions[current];
  questionText.textContent = q.q;
  answerInput.style.display = "none";

  // Clear previous MCQs if any
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
}

function submitAnswer(auto = false) {
  clearInterval(timer);

  const userAnswer = answerInput.value.trim().toLowerCase();
  const correct = questions[current].a;

  if (Array.isArray(correct)) {
    if (correct.includes(userAnswer)) score += questions[current].points;
  } else {
    if (userAnswer === correct) score += questions[current].points;
  }

  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
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

window.onload = loadQuestion;
