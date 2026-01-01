const lessons = [
  {
    title: "Variables",
    video: "lesson1.mp4",
    reading: "Variables store data that your game uses — numbers, text, or booleans. In C#, you must declare the data type.",
    example: `int score = 0;
float speed = 5.5f;
string playerName = "Alex";`,
    activity: [
      { term: "int", meaning: "Stores whole numbers" },
      { term: "float", meaning: "Stores decimal numbers" },
      { term: "string", meaning: "Stores text data" }
    ]
  },
  {
    title: "Methods",
    video: "lesson2.mp4",
    reading: "Methods are functions that perform actions. You can call them to reuse code.",
    example: `void Jump() {
  Debug.Log("Jump!");
}`,
    activity: [
      { term: "void", meaning: "Returns nothing" },
      { term: "parameter", meaning: "Information passed into a method" },
      { term: "return", meaning: "Sends data back from a method" }
    ]
  },
  {
    title: "void Start() and Update()",
    video: "lesson3.mp4",
    reading: "Unity calls Start() once at the beginning and Update() every frame. These are the foundation of Unity scripts.",
    example: `void Start() {
  Debug.Log("Game Start");
}

void Update() {
  transform.Translate(Vector3.forward * Time.deltaTime);
}`,
    activity: [
      { term: "Start()", meaning: "Runs once when the script starts" },
      { term: "Update()", meaning: "Runs every frame" },
      { term: "Time.deltaTime", meaning: "Smooths movement between frames" }
    ]
  },
  {
    title: "Changing GameObject Properties",
    video: "lesson4.mp4",
    reading: "You can modify a GameObject’s position, scale, and color through its components.",
    example: `transform.position = new Vector3(0, 3, 0);
GetComponent<Renderer>().material.color = Color.red;`,
    activity: [
      { term: "transform", meaning: "Controls object’s position and scale" },
      { term: "GetComponent", meaning: "Finds a component in the object" },
      { term: "Color", meaning: "Used to set material color" }
    ]
  },
  {
    title: "Conditionals (if Statements)",
    video: "lesson5.mp4",
    reading: "Conditionals let you decide when code should run. They're essential for checking states like health or score.",
    example: `if (health <= 0) {
  Debug.Log("Game Over");
}`,
    activity: [
      { term: "if", meaning: "Checks a condition" },
      { term: "else", meaning: "Executes if the condition is false" },
      { term: "==", meaning: "Tests for equality" }
    ]
  },
  {
    title: "Combining Concepts",
    video: "lesson6.mp4",
    reading: "Let’s combine all skills to make simple mechanics using methods and conditionals.",
    example: `int score = 0;

void AddScore() {
  score += 10;
  if (score >= 100) {
    Debug.Log("You win!");
  }
}`,
    activity: [
      { term: "AddScore()", meaning: "Increases the player score" },
      { term: "score", meaning: "Tracks player points" },
      { term: "Debug.Log", meaning: "Displays message in console" }
    ]
  }
];

const videoSection = document.getElementById('video-section');
const readingSection = document.getElementById('reading-section');
const activitySection = document.getElementById('activity-section');
const quizSection = document.getElementById('quiz-section');
const feedback = document.getElementById('activity-feedback');
const nextLessonBtn = document.getElementById('next-lesson-btn');
const progressText = document.getElementById('progress-text');

let currentLesson = parseInt(localStorage.getItem('unity_course1_progress')) || 0;
updateLessonDisplay();

function updateLessonDisplay() {
  const lesson = lessons[currentLesson];
  document.getElementById('lesson-title').textContent = `Lesson ${currentLesson + 1}: ${lesson.title}`;
  document.getElementById('lesson-video-src').src = lesson.video;
  document.getElementById('lesson-video').load();
  progressText.textContent = `Lesson ${currentLesson + 1} of ${lessons.length}`;
}

document.getElementById('continue-btn').onclick = () => {
  videoSection.classList.add('hidden');
  readingSection.classList.remove('hidden');
  const lesson = lessons[currentLesson];
  document.getElementById('reading-title').textContent = lesson.title;
  document.getElementById('reading-content').textContent = lesson.reading;
  document.getElementById('reading-example').textContent = lesson.example;
};

document.getElementById('start-activity-btn').onclick = () => {
  readingSection.classList.add('hidden');
  activitySection.classList.remove('hidden');
  feedback.textContent = '';
  nextLessonBtn.classList.add('hidden');
  buildActivity();
};

function buildActivity() {
  const lesson = lessons[currentLesson];
  const container = document.getElementById('drag-container');
  container.innerHTML = `
    <div class="draggables">
      ${lesson.activity.map(a => `<div class="draggable" draggable="true" data-term="${a.term}">${a.term}</div>`).join('')}
    </div>
    <div class="droppables">
      ${lesson.activity.map(a => `<div class="droppable" data-term="${a.term}">${a.meaning}</div>`).join('')}
    </div>`;
  enableDragDrop();
}

function enableDragDrop() {
  const draggables = document.querySelectorAll('.draggable');
  const droppables = document.querySelectorAll('.droppable');
  let correctCount = 0;
  let selectedDrag = null;
  const lesson = lessons[currentLesson];

  draggables.forEach(drag => {
    // Desktop drag-drop
    drag.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text', drag.dataset.term);
    });

    // Mobile touch support
    drag.addEventListener('touchstart', e => {
      selectedDrag = drag;
      drag.classList.add('dragging');
      e.preventDefault();
    });
  });

  droppables.forEach(drop => {
    // Desktop drag-drop
    drop.addEventListener('dragover', e => e.preventDefault());
    drop.addEventListener('drop', e => {
      const draggedTerm = e.dataTransfer.getData('text');
      handleMatch(draggedTerm, drop);
    });

    // Mobile touch support
    drop.addEventListener('touchend', e => {
      if (selectedDrag) {
        const draggedTerm = selectedDrag.dataset.term;
        handleMatch(draggedTerm, drop);
        selectedDrag.classList.remove('dragging');
        selectedDrag = null;
      }
      e.preventDefault();
    });
  });

  function handleMatch(draggedTerm, drop) {
    if (!drop.classList.contains('correct')) {
      if (draggedTerm === drop.dataset.term) {
        drop.classList.add('correct');
        correctCount++;
        feedback.textContent = `✅ ${draggedTerm} is correct! (${correctCount}/${lesson.activity.length})`;
      } else {
        drop.classList.add('wrong');
        feedback.textContent = `❌ Incorrect match. Try again! (${correctCount}/${lesson.activity.length})`;
      }

      if (correctCount >= lesson.activity.length) {
        nextLessonBtn.classList.remove('hidden');
        feedback.textContent = "🎉 Great work! You completed this activity.";
      } else if (correctCount < 2 && document.querySelectorAll('.wrong').length >= 1) {
        feedback.textContent = "⚠️ You need to review again.";
        setTimeout(() => {
          activitySection.classList.add('hidden');
          readingSection.classList.remove('hidden');
          feedback.textContent = '';
        }, 1500);
      }
    }
  }
}

nextLessonBtn.onclick = () => {
  if (currentLesson < lessons.length - 1) {
    currentLesson++;
    localStorage.setItem('unity_course1_progress', currentLesson);
    activitySection.classList.add('hidden');
    videoSection.classList.remove('hidden');
    updateLessonDisplay();
  } else {
    localStorage.setItem('unity_course1_progress', 'quiz');
    startQuiz();
  }
};

// Quiz
function startQuiz() {
  videoSection.classList.add('hidden');
  activitySection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  const quizQuestions = [
    { q: "What does 'void' mean in C#?", options: ["Returns a value", "Returns nothing", "Creates variable"], correct: 1 },
    { q: "Which Unity function runs every frame?", options: ["Start()", "Update()", "Repeat()"], correct: 1 },
    { q: "What component controls position?", options: ["Transform", "Rigidbody", "Collider"], correct: 0 },
    { q: "What keyword checks a condition?", options: ["for", "if", "when"], correct: 1 },
    { q: "Which is used for text?", options: ["int", "bool", "string"], correct: 2 }
  ];

  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = quizQuestions.map((q, i) => `
    <div class="quiz-question">
      <p>${i + 1}. ${q.q}</p>
      ${q.options.map((opt, j) =>
        `<label><input type="radio" name="q${i}" value="${j}">${opt}</label>`
      ).join('<br>')}
    </div>`).join('<hr>');

  let timeLeft = 300;
  const timerEl = document.getElementById('quiz-timer');
  const timer = setInterval(() => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerEl.textContent = `Time Left: ${m}:${s < 10 ? '0' : ''}${s}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);

  document.getElementById('submit-quiz-btn').onclick = submitQuiz;

  function submitQuiz() {
    clearInterval(timer);
    let score = 0;
    quizQuestions.forEach((q, i) => {
      const ans = document.querySelector(`input[name="q${i}"]:checked`);
      if (ans && parseInt(ans.value) === q.correct) score++;
    });
    document.getElementById('quiz-result').textContent = `You scored ${score}/${quizQuestions.length}!`;
    localStorage.setItem('unity_course1_progress', 'complete');
    document.getElementById('dashboard-btn').classList.remove('hidden');
  }
}

document.getElementById('dashboard-btn').onclick = () => {
  localStorage.removeItem('unity_course1_progress');
  window.location.href = "dashboard.html";
};

if (localStorage.getItem('unity_course1_progress') === 'quiz') startQuiz();
else if (localStorage.getItem('unity_course1_progress') === 'complete') {
  quizSection.classList.remove('hidden');
  document.getElementById('quiz-result').textContent = "✅ Course Complete!";
  document.getElementById('dashboard-btn').classList.remove('hidden');
}
