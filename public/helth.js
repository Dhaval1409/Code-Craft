 flatpickr("#reminder-time", { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true });

    function addReminder() {
      const time = document.getElementById("reminder-time").value;
      const note = document.getElementById("reminder-note").value;
      if (!time || !note) return alert("Please enter both time and note.");

      const reminder = document.createElement("div");
      reminder.className = "alert alert-secondary d-flex justify-content-between align-items-center";
      reminder.innerHTML = `
        <div><strong>${time}</strong><br>${note}</div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" checked />
        </div>
      `;
      document.getElementById("reminderList").appendChild(reminder);

      bootstrap.Modal.getInstance(document.getElementById('reminderModal')).hide();
      document.getElementById("reminder-time").value = "";
      document.getElementById("reminder-note").value = "";
    }