const lessons = [
  {
    title: "What is Unity AI?",
    video: "lessonAI1.mp4",
    reading: "Unity AI helps NPCs make decisions and move intelligently. Common tools include NavMeshAgent, pathfinding, and simple decision systems.",
    example: `// Basic NavMeshAgent set destination\nvar agent = GetComponent<UnityEngine.AI.NavMeshAgent>();\nagent.SetDestination(target.position);`,
    activity: [
      { term: "NavMeshAgent", meaning: "Component used for pathfinding and movement" },
      { term: "NavMesh", meaning: "Navigation mesh baked from level geometry" },
      { term: "SetDestination", meaning: "Command to move agent to a point" }
    ]
  },
  {
    title: "What is it used for?",
    video: "lessonAI2.mp4",
    reading: "AI is used for enemies, allies, NPCs and interactive objects to behave believably in the world.",
    example: `// Example: make an enemy chase the player\nif (Vector3.Distance(transform.position, player.position) < 10f) {\n  agent.SetDestination(player.position);\n}`,
    activity: [
      { term: "Chase", meaning: "Follow the player using pathfinding" },
      { term: "Patrol", meaning: "Move between waypoints" },
      { term: "Distance check", meaning: "Trigger behavior within range" }
    ]
  },
  {
    title: "Why AI matters",
    video: "lessonAI3.mp4",
    reading: "Good AI improves game feel: challenge, immersion and predictable-but-interesting behaviour.",
    example: `// Simple condition: react when spotted\nif (CanSeePlayer()) {\n  ChasePlayer();\n} else {\n  Patrol();\n}`,
    activity: [
      { term: "Immersion", meaning: "How believable the world feels" },
      { term: "Challenge", meaning: "Difficulty created by AI behaviors" },
      { term: "Predictability", meaning: "Players can learn and react to AI" }
    ]
  },
  {
    title: "How: Pathfinding & NavMesh",
    video: "lessonAI4.mp4",
    reading: "Bake a NavMesh and use NavMeshAgent to find walkable paths. This handles obstacles and complex geometry for you.",
    example: `// Bake NavMesh in editor; use agent to move\nagent.SetDestination(goal.position);`,
    activity: [
      { term: "Bake", meaning: "Generate the NavMesh in the editor" },
      { term: "Agent", meaning: "NavMeshAgent component on NPC" },
      { term: "Obstacle", meaning: "Objects that block paths" }
    ]
  },
  {
    title: "How: State Machines",
    video: "lessonAI5.mp4",
    reading: "Use simple state machines (Patrol, Chase, Attack) to organize behavior and switch based on conditions.",
    example: `enum State { Patrol, Chase, Attack }\nState state = State.Patrol;\nswitch(state) { case State.Patrol: Patrol(); break; }`,
    activity: [
      { term: "State", meaning: "Current behavior mode" },
      { term: "Transition", meaning: "Change from one state to another" },
      { term: "FSM", meaning: "Finite State Machine" }
    ]
  },
  {
    title: "Finishing & Optimization",
    video: "lessonAI6.mp4",
    reading: "Profile AI, reduce update costs, use distance checks and LOD for NPCs to keep performance good.",
    example: `// Only update path every 0.5s to save CPU\nInvokeRepeating("UpdatePath", 0, 0.5f);`,
    activity: [
      { term: "Profile", meaning: "Measure performance" },
      { term: "LOD", meaning: "Level of Detail for AI updates" },
      { term: "InvokeRepeating", meaning: "Call a method repeatedly on a timer" }
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

let currentLesson = parseInt(localStorage.getItem('ai_course_progress')) || 0;
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

  draggables.forEach(drag => {
    drag.addEventListener('dragstart', e => e.dataTransfer.setData('text', drag.dataset.term));
  });

  droppables.forEach(drop => {
    drop.addEventListener('dragover', e => e.preventDefault());
    drop.addEventListener('drop', e => {
      const draggedTerm = e.dataTransfer.getData('text');
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
    });
  });
}

nextLessonBtn.onclick = () => {
  if (currentLesson < lessons.length - 1) {
    currentLesson++;
    localStorage.setItem('ai_course_progress', currentLesson);
    activitySection.classList.add('hidden');
    videoSection.classList.remove('hidden');
    updateLessonDisplay();
  } else {
    localStorage.setItem('ai_course_progress', 'quiz');
    startQuiz();
  }
};

// Quiz
function startQuiz() {
  videoSection.classList.add('hidden');
  activitySection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  const quizQuestions = [
    { q: "What is a NavMeshAgent used for?", options: ["Rendering models", "Pathfinding and movement", "Handling input"], correct: 1 },
    { q: "Why bake a NavMesh?", options: ["To generate navigation data for agents", "To create textures", "To export models"], correct: 0 },
    { q: "What benefit does good AI bring to a game?", options: ["Better immersion and challenge", "Faster loading times", "Higher resolution textures"], correct: 0 },
    { q: "Which step uses NavMesh to avoid obstacles?", options: ["State machine", "Pathfinding", "Profiling"], correct: 1 },
    { q: "What does a State Machine help organize?", options: ["Graphic settings", "Behavior modes like Patrol/Chase/Attack", "Sound mixing"], correct: 1 },
    { q: "Why optimize AI updates?", options: ["To reduce CPU usage and improve performance", "To change colors of NPCs", "To increase texture size"], correct: 0 }
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
    localStorage.setItem('ai_course_progress', 'complete');
    document.getElementById('dashboard-btn').classList.remove('hidden');
  }
}

document.getElementById('dashboard-btn').onclick = () => {
  localStorage.removeItem('ai_course_progress');
  window.location.href = "dashboard.html";
};

if (localStorage.getItem('ai_course_progress') === 'quiz') startQuiz();
else if (localStorage.getItem('ai_course_progress') === 'complete') {
  quizSection.classList.remove('hidden');
  document.getElementById('quiz-result').textContent = "✅ Course Complete!";
  document.getElementById('dashboard-btn').classList.remove('hidden');
}
