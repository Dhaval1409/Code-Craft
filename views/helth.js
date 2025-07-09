// Initialize Flatpickr
flatpickr("#reminder-time", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true
});

const reminders = [];

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

  bootstrap.Modal.getInstance(document.getElementById('reminderModal')).hide();
  document.getElementById("reminder-time").value = "";
  document.getElementById("reminder-note").value = "";
}

setInterval(() => {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

  reminders.forEach(r => {
    if (r.time === currentTime) {
      alert(`⏰ Reminder: ${r.note}`);
    }
  });
}, 60000);

function callEmergency() {
  window.location.href = "tel:108";
}
