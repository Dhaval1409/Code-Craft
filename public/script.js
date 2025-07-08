// script.js
document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    userInput.value = "";

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      chatBox.innerHTML += `<div class="message bot">${data.reply}</div>`;
    } catch (error) {
      chatBox.innerHTML += `<div class="message bot">Error: Could not get response.</div>`;
      console.error("Fetch error:", error);
    }

    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  });
});
