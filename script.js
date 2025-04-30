const questions = [
    { q: "What does CPU stand for?", a: "central processing unit", points: 2 },
    { q: "What does GPU stand for?", a: "graphics processing unit", points: 2 },
    { q: "What does RAM stand for?", a: "random access memory", points: 2 },
    { q: "What does PSU stand for?", a: "power supply", points: 2 },
    { q: "Which key on the keyboard is used to capitalize letters?", a: ["shift", "capslock"], points: 2 },
    { q: "Is ten greater than 20?", a: "no", points: 1 },
    { q: "What does IDE stand for?", a: "integrated development environment", points: 2 },
    { q: "In which year was the Python 3.0 version developed?", a: "2008", points: 3 },
    { q: "What does FPS stand for?", a: "frames per second", points: 2 },
    { q: "What does Mbps stand for?", a: "megabits per second", points: 2 },
    { q: "What does HTML stand for?", a: "hypertext markup language", points: 2 },
    { q: "What does CSS stand for?", a: "cascading style sheets", points: 2 },
    { q: "What does HTTP stand for?", a: "hypertext transfer protocol", points: 2 },
    { q: "What does SQL stand for?", a: "structured query language", points: 2 },
    { q: "What does API stand for?", a: "application programming interface", points: 2 },
  ];
  
  let current = 0;
  let score = 0;
  
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const finalScore = document.getElementById("final-score");
  
  function loadQuestion() {
    if (current < questions.length) {
      questionText.textContent = questions[current].q;
      answerInput.value = "";
    } else {
      document.getElementById("quiz-box").style.display = "none";
      document.getElementById("result-box").style.display = "block";
      finalScore.textContent = `${score} out of 30`;
    }
  }
  
  function submitAnswer() {
    let userAnswer = answerInput.value.trim().toLowerCase();
    let correct = questions[current].a;
    
    if (Array.isArray(correct)) {
      if (correct.includes(userAnswer)) {
        score += questions[current].points;
      }
    } else {
      if (userAnswer === correct) {
        score += questions[current].points;
      }
    }
  
    current++;
    loadQuestion();
  }
  
  function restartQuiz() {
    current = 0;
    score = 0;
    document.getElementById("quiz-box").style.display = "block";
    document.getElementById("result-box").style.display = "none";
    loadQuestion();
  }
  
  window.onload = loadQuestion;
  