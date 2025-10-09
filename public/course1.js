// Data for all 6 lessons
const lessons = [
  {
    title: "Lesson 1: Variables",
    video: "lesson1.mp4",
    description: "Variables are used to store data values. They can hold integers, strings, floats, and more.",
    example: `int score = 0;\nfloat speed = 3.5f;\nstring playerName = "Hero";`,
    activity: {
      question: "Match the variable type to its correct example:",
      pairs: {
        "int": "Whole number",
        "float": "Decimal number",
        "string": "Text value"
      }
    }
  },
  {
    title: "Lesson 2: Methods",
    video: "lesson2.mp4",
    description: "Methods are blocks of code that perform specific tasks. They make code reusable.",
    example: `void Jump() {\n   Debug.Log("Jump!");\n}`,
    activity: {
      question: "Match each concept to its meaning:",
      pairs: {
        "Method": "Performs an action",
        "Return type": "Defines what the method outputs",
        "Parameter": "Data passed into a method"
      }
    }
  },
  {
    title: "Lesson 3: void Start() and Update()",
    video: "lesson3.mp4",
    description: "Start() runs once at the beginning. Update() runs every frame.",
    example: `void Start() {\n   Debug.Log("Game started");\n}\n\nvoid Update() {\n   transform.Translate(1 * Time.deltaTime, 0, 0);\n}`,
    activity: {
      question: "Match the Unity functions with their purpose:",
      pairs: {
        "Start()": "Runs once when the game begins",
        "Update()": "Runs every frame",
        "Time.deltaTime": "Smooth frame-based movement"
      }
    }
  },
  {
    title: "Lesson 4: Changing GameObject Properties",
    video: "lesson4.mp4",
    description: "You can modify GameObject properties such as position, scale, and color in scripts.",
    example: `transform.position = new Vector3(0, 5, 0);\nGetComponent<Renderer>().material.color = Color.red;`,
    activity: {
      question: "Match the property with what it changes:",
      pairs: {
        "transform.position": "Moves the GameObject",
        "transform.localScale": "Resizes the GameObject",
        "material.color": "Changes the GameObject color"
      }
    }
  },
  {
    title: "Lesson 5: Conditionals",
    video: "lesson5.mp4",
    description: "Conditionals let you make decisions in code using if, else if, and else.",
    example: `if (score > 10) {\n   Debug.Log("You win!");\n} else {\n   Debug.Log("Keep trying!");\n}`,
    activity: {
      question: "Match the conditionals to their behavior:",
      pairs: {
        "if": "Runs when condition is true",
        "else if": "Checks another condition",
        "else": "Runs when all other conditions are false"
      }
    }
  },
  {
    title: "Lesson 6: Combining Everything",
    video: "lesson6.mp4",
    description: "Combine all you learned: use variables, methods, and conditions to create simple behaviors.",
    example: `int health = 100;\nvoid Update() {\n  if (health <= 0) {\n    Debug.Log("Game Over");\n  }\n}`,
    activity: {
      question: "Match each term to its role:",
      pairs: {
        "Variable": "Stores data",
        "Method": "Executes code repeatedly",
        "Conditional": "Checks for true/false situations"
      }
    }
  }
];

let currentLesson = 0;

// Elements
const title = document.getElementById("lesson-title");
const video = document.getElementById("lesson-video");
const desc = document.getElementById("lesson-description");
const example = document.getElementById("lesson-example");
const continueBtn = document.getElementById("continue-btn");
const toActivityBtn = document.getElementById("toActivityBtn");
const nextLessonBtn = document.getElementById("nextLessonBtn");
const reading = document.getElementById("lesson-reading");
const videoContainer = document.getElementById("lesson-video-container");
const activity = document.getElementById("lesson-activity");
const feedback = document.getElementById("activity-feedback");
const dragContainer = document.getElementById("draggable-container");
const dropContainer = document.getElementById("droppable-container");
const quizSection = document.getElementById("quiz-section");
const lockedSection = document.getElementById("locked-section");
const lessonSection = document.getElementById("lesson-section");

function loadLesson(index) {
  const l = lessons[index];
  title.textContent = l.title;
  video.src = l.video;
  desc.textContent = l.description;
  example.textContent = l.example;

  // Reset visibility
  videoContainer.classList.remove("hidden");
  reading.classList.add("hidden");
  activity.classList.add("hidden");
  feedback.textContent = "";

  // Setup activity
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  document.getElementById("activity-instruction").textContent = l.activity.question;

  for (const [key, val] of Object.entries(l.activity.pairs)) {
    const drag = document.createElement("div");
    drag.textContent = key;
    drag.classList.add("draggable");
    drag.setAttribute("draggable", "true");
    drag.dataset.match = key;
    dragContainer.appendChild(drag);

    const drop = document.createElement("div");
    drop.textContent = val;
    drop.classList.add("droppable");
    drop.dataset.accept = key;
    dropContainer.appendChild(drop);
  }
  setupDragDrop();
}

continueBtn.onclick = () => {
  videoContainer.classList.add("hidden");
  reading.classList.remove("hidden");
};

toActivityBtn.onclick = () => {
  reading.classList.add("hidden");
  activity.classList.remove("hidden");
};

nextLessonBtn.onclick = () => {
  currentLesson++;
  if (currentLesson < lessons.length) {
    loadLesson(currentLesson);
  } else {
    lessonSection.classList.add("hidden");
    startQuiz();
  }
};

function setupDragDrop() {
  const draggables = document.querySelectorAll(".draggable");
  const droppables = document.querySelectorAll(".droppable");

  draggables.forEach(drag => {
    drag.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", drag.dataset.match);
    });
  });

  droppables.forEach(drop => {
    drop.addEventListener("dragover", e => e.preventDefault());
    drop.addEventListener("drop", e => {
      const draggedData = e.dataTransfer.getData("text");
      if (draggedData === drop.dataset.accept) {
        drop.classList.add("correct");
        feedback.textContent = `✅ Correct: "${draggedData}" matched!`;
      } else {
        drop.classList.add("wrong");
        feedback.textContent = `❌ Try again.`;
      }
    });
  });
}

// ---- QUIZ ----
function startQuiz() {
  quizSection.classList.remove("hidden");
  const timerEl = document.getElementById("quiz-timer");
  const quizContainer = document.getElementById("quiz-container");
  const submitBtn = document.getElementById("submitQuizBtn");
  const resultEl = document.getElementById("quiz-result");

  const quiz = [
    { q: "Which keyword defines a method in C#?", o: ["void", "public", "class", "main"], a: 0 },
    { q: "What function runs once at start?", o: ["Update()", "Awake()", "Start()", "Run()"], a: 2 },
    { q: "Which function runs every frame?", o: ["Loop()", "Update()", "Run()", "Frame()"], a: 1 },
    { q: "Which command changes color of GameObject?", o: ["transform.scale", "material.color", "colorChange()", "setColor"], a: 1 },
    { q: "Conditionals check for:", o: ["Loops", "Decisions", "Variables", "Imports"], a: 1 }
  ];

  quizContainer.innerHTML = quiz.map((q, i) => `
    <div>
      <p>${i + 1}. ${q.q}</p>
      ${q.o.map((opt, j) => `<label><input type="radio" name="q${i}" value="${j}">${opt}</label>`).join("<br>")}
    </div>
  `).join("<hr>");

  let timeLeft = 300;
  const timer = setInterval(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerEl.textContent = `Time Left: ${min}:${sec < 10 ? "0" : ""}${sec}`;
    if (--timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);

  submitBtn.onclick = submitQuiz;

  function submitQuiz() {
    clearInterval(timer);
    let score = 0;
    quiz.forEach((q, i) => {
      const ans = document.querySelector(`input[name="q${i}"]:checked`);
      if (ans && parseInt(ans.value) === q.a) score++;
    });
    resultEl.textContent = `You scored ${score}/${quiz.length}!`;
    localStorage.setItem("course1Locked", "true");

    setTimeout(() => {
      quizSection.classList.add("hidden");
      lockedSection.classList.remove("hidden");
    }, 2500);
  }
}

// ---- Lock check ----
window.onload = () => {
  if (localStorage.getItem("course1Locked") === "true") {
    lessonSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    lockedSection.classList.remove("hidden");
  } else {
    loadLesson(currentLesson);
  }
};
