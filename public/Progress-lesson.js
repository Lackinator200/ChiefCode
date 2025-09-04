const lessonsCompleted = 12;
const totalLessons = 35;

const percentComplete = Math.round((lessonsCompleted / totalLessons) * 100);

// Update progress bar and text
document.getElementById("course-fill").style.width = percentComplete + "%";
document.getElementById("course-percent").innerText = percentComplete + "%";
document.getElementById("course-lessons").innerText = `${lessonsCompleted}/${totalLessons}`;

