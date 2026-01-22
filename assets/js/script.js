/* ======================================================
   MUSICAL FORTNITE – CORE SCRIPT
   Handles:
   - Navigation
   - Progress storage
   - Lesson completion
   - Badges
   - Piano sounds
   - Utilities
====================================================== */

/* ==============================
   NAVIGATION
============================== */
function go(page) {
  window.location.href = page;
}

/* ==============================
   LOCAL STORAGE SETUP
============================== */
const STORAGE_KEY = "musicApp";

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      lessons: {},     // completed lessons
      quizzes: {},     // quiz scores
      badges: {},      // earned badges
      streak: {
        current: 0,
        best: 0,
        lastDate: null
      }
    })
  );
}

/* ==============================
   STORAGE HELPERS
============================== */
function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ==============================
   DATE HELPER (STREAK)
============================== */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* ==============================
   STREAK LOGIC
============================== */
function updateStreak() {
  const data = getData();
  const t = today();

  if (data.streak.lastDate !== t) {
    data.streak.current += 1;
    if (data.streak.current > data.streak.best) {
      data.streak.best = data.streak.current;
    }
    data.streak.lastDate = t;
    saveData(data);
  }
}

/* ==============================
   LESSON COMPLETION
============================== */
function completeLesson(lessonId) {
  const data = getData();

  if (!data.lessons[lessonId]) {
    data.lessons[lessonId] = true;
    saveData(data);
    updateStreak();
    unlockBadges();
    playCompleteSound();
    alert("✅ Lesson completed!");
  } else {
    alert("You already completed this lesson.");
  }
}

/* ==============================
   CHECK IF LESSON IS COMPLETED
============================== */
function isLessonCompleted(lessonId) {
  const data = getData();
  return !!data.lessons[lessonId];
}

/* ==============================
   BADGES SYSTEM
============================== */
function unlockBadge(id, title, description) {
  const data = getData();

  if (!data.badges[id]) {
    data.badges[id] = {
      title: title,
      description: description,
      date: new Date().toLocaleDateString()
    };
    saveData(data);
    alert(`🏅 Badge Unlocked: ${title}`);
  }
}

function unlockBadges() {
  const data = getData();
  const completedLessons = Object.keys(data.lessons).length;

  if (completedLessons >= 1) {
    unlockBadge(
      "first_lesson",
      "First Note",
      "Completed your first lesson"
    );
  }

  if (completedLessons >= 3) {
    unlockBadge(
      "starter",
      "Music Starter",
      "Completed one full topic"
    );
  }

  if (completedLessons >= 9) {
    unlockBadge(
      "dedicated",
      "Dedicated Learner",
      "Completed three topics"
    );
  }

  if (completedLessons >= 27) {
    unlockBadge(
      "music_master",
      "Music Master",
      "Completed all lessons"
    );
  }
}

/* ==============================
   QUIZ SUPPORT (BASIC)
============================== */
function saveQuizScore(topic, score, total) {
  const data = getData();
  data.quizzes[topic] = {
    score: score,
    total: total,
    percent: Math.round((score / total) * 100)
  };
  saveData(data);
  unlockBadges();
}

/* ==============================
   SOUND CONTROLS
============================== */
let soundEnabled = true;

function toggleSound() {
  soundEnabled = !soundEnabled;
  alert(soundEnabled ? "🔊 Sound On" : "🔇 Sound Off");
}

function playSound(src) {
  if (!soundEnabled) return;
  const audio = new Audio(src);
  audio.play();
}

function playClickSound() {
  playSound("assets/sounds/ui/click.mp3");
}

function playCompleteSound() {
  playSound("assets/sounds/ui/complete.mp3");
}

/* ==============================
   PIANO FUNCTIONS
============================== */
function playNote(note) {
  playSound(`../assets/sounds/${note}.mp3`);
}

/* ==============================
   RESET PROGRESS
============================== */
function resetProgress() {
  if (confirm("Are you sure you want to reset all progress?")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

/* ==============================
   DEBUG (OPTIONAL)
============================== */
function debugData() {
  console.log(getData());
    }
