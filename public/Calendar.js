
const calendar = document.getElementById("calendar");
const events = {}; // Store events per day

function renderCalendar() {
  calendar.innerHTML = ""; // Clear before re-render
  for (let i = 1; i <= 31; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.id = "day-" + i;
    const eventText = events[i] ? `<div class="event">${events[i]}</div>` : "";
    dayDiv.innerHTML = `<strong>${i}</strong>${eventText}`;
    calendar.appendChild(dayDiv);
  }
}

function showPopup() {
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function addEvent() {
  const day = parseInt(document.getElementById("dayInput").value);
  const title = document.getElementById("eventInput").value;

  if (day && title && day >= 1 && day <= 31) {
    events[day] = title;
    renderCalendar(); // Re-render to update
    closePopup();
  } else {
    alert("Please enter a valid date and event.");
  }
}

renderCalendar(); // Initial call to populate