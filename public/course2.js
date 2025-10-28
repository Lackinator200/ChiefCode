const lessons = [
  {
    title: "Function in audio layout",
    video: "lessonAudioU1.mp4",
    reading: "Unity has the section where users can add their audio in specific area of their game.",
    example: `AudioSource audioSource = GetComponent<AudioSource>()`,
    activity: [
      { term: "int", meaning: "Stores whole numbers" },
      { term: "float", meaning: "Stores decimal numbers" },
      { term: "string", meaning: "Stores text data" }
    ]
  },
  {
    title: "Working with Audio in Unity",
    video: "lessonAudio2.mp4",
    reading: "Audio brings your game to life. In Unity you use AudioClips (the sound files) and AudioSources (the component that plays them). We'll cover how to add an AudioSource, play clips, control volume and spatial settings, and why audio design matters for feedback and immersion.",
    example: `// Attach this to a GameObject that has an AudioSource component
public class PlaySound : MonoBehaviour {
  public AudioClip clip; // assign in Inspector
  private AudioSource audioSource;

  void Start() {
    audioSource = GetComponent<AudioSource>();
    audioSource.clip = clip;
    audioSource.playOnAwake = false; // don't automatically play on load
    audioSource.spatialBlend = 1.0f; // 3D sound
    audioSource.maxDistance = 20f;
  }

  // Call this method to play the clip once
  public void PlayOnce(float volume = 1f) {
    audioSource.PlayOneShot(clip, volume);
  }

  // Example: call PlayOnce when player jumps
  void Update() {
    if (Input.GetKeyDown(KeyCode.Space)) {
      PlayOnce(0.8f);
    }
  }
}`,
    activity: [
      { term: "AudioSource", meaning: "Component that plays AudioClips" },
      { term: "AudioClip", meaning: "An audio file (wav/mp3) used as a sound" },
      { term: "spatialBlend", meaning: "0 = 2D (UI); 1 = 3D (world) sound positioning" }
    ]
  },
  {
    title: "Update()",
    video: "lessonAudio3.mp4",
    reading: "We'll use Update() to check inputs and trigger audio playback when needed.",
    example: `void Update() {
  if (Input.GetKeyDown(KeyCode.Space)) {
    GetComponent<AudioSource>().PlayOneShot(jumpClip);
  }
}`,
    activity: [
      { term: "GetKeyDown", meaning: "Detects a key press this frame" },
      { term: "PlayOneShot", meaning: "Plays a clip once without interrupting others" },
      { term: "jumpClip", meaning: "An AudioClip assigned in the Inspector" }
    ]
  },
  {
    title: "Changing GameObject Properties",
    video: "lessonAudio4.mp4",
    reading: "Audio settings on a GameObject affect how sound is heard. Use AudioSource properties like volume and spatialBlend to tweak perception.",
    example: `var src = GetComponent<AudioSource>();
src.volume = 0.7f; // lower volume
src.spatialBlend = 1f; // make sound 3D
src.maxDistance = 15f;`,
    activity: [
      { term: "volume", meaning: "Loudness of the AudioSource (0-1)" },
      { term: "maxDistance", meaning: "How far the 3D sound can be heard" },
      { term: "spatialBlend", meaning: "Mix between 2D and 3D sound" }
    ]
  },
  {
    title: "Conditionals (if Statements)",
    video: "lessonAudio5.mp4",
    reading: "Use conditionals to trigger sounds at events. For example, play a damage sound when health falls below a threshold.",
    example: `if (health <= 0) {
  GetComponent<AudioSource>().PlayOneShot(deathClip);
}`,
    activity: [
      { term: "if", meaning: "Check a condition to trigger audio" },
      { term: "deathClip", meaning: "An AudioClip for death sound" },
      { term: "PlayOneShot", meaning: "Play short feedback sounds without stopping others" }
    ]
  },
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
          feedback.textContent = `✅ ${draggedTerm} is correct! (${correctCount}/3)`;
        } else {
          drop.classList.add('wrong');
          feedback.textContent = `❌ Incorrect match. Try again! (${correctCount}/3)`;
        }

        if (correctCount >= 3) {
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
    { q: "Which component plays audio clips in Unity?", options: ["AudioSource", "AudioClip", "Rigidbody"], correct: 0 },
    { q: "Where do you assign an AudioClip to play?", options: ["In the Inspector on an AudioSource", "In the Transform component", "In the Renderer"], correct: 0 },
    { q: "What does PlayOneShot do?", options: ["Plays a clip once without interrupting others", "Loops a clip forever", "Deletes a clip"], correct: 0 },
    { q: "Which property mixes 2D and 3D audio?", options: ["maxDistance", "volume", "spatialBlend"], correct: 2 },
    { q: "When would you trigger audio in code?", options: ["On an event like jump or death", "Only in Start() always", "Never"], correct: 0 }
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
