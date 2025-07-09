// Initialize Flatpickr
flatpickr("#reminder-time", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true
});

const reminders = [];

// Use an online alarm sound
const audio = new Audio("https://www.soundjay.com/button/beep-07.mp3");

// Ask for notification permission on page load
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function addReminder() {
  const time = document.getElementById("reminder-time").value;
  const note = document.getElementById("reminder-note").value;

  if (!time || !note) return alert("Please enter both time and note.");

  reminders.push({ time, note });

  const reminderDiv = document.createElement("div");
  reminderDiv.className = "alert alert-secondary d-flex justify-content-between align-items-center";
  reminderDiv.innerHTML = `
    <div><strong>${time}</strong><br>${note}</div>
    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" checked />
    </div>
  `;
  document.getElementById("reminderList").appendChild(reminderDiv);

  // Close modal and reset inputs
  bootstrap.Modal.getInstance(document.getElementById('reminderModal')).hide();
  document.getElementById("reminder-time").value = "";
  document.getElementById("reminder-note").value = "";
}

function playAlarm(note) {
  audio.play();

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("⏰ Reminder!", {
      body: note,
      icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
    });
  }
}

// Check reminders every minute
setInterval(() => {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

  reminders.forEach(r => {
    if (r.time === currentTime) {
      playAlarm(r.note);
    }
  });
}, 60000);

function callEmergency() {
  window.location.href = "tel:108";
}
