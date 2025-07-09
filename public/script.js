document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const micBtn = document.getElementById("mic-btn");

  async function sendMessage(message) {
    if (!message) return;

    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.textContent = message;
    chatBox.appendChild(userMsg);
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const response = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

      const data = await response.json();

      const botMsg = document.createElement("div");
      botMsg.classList.add("message", "bot");
      botMsg.textContent = data.reply;
      chatBox.appendChild(botMsg);
      chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
      const errorMsg = document.createElement("div");
      errorMsg.classList.add("message", "bot");
      errorMsg.textContent = "❌ Error: Could not get response.";
      chatBox.appendChild(errorMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
      console.error("Fetch error:", error);
    }
  }

  sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) sendMessage(message);
  });

  // Voice Recognition (input only, no audio reply)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onstart = () => {
      micBtn.style.color = "red";
    };

    recognition.onend = () => {
      micBtn.style.color = "";
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      userInput.value = voiceText;
      sendMessage(voiceText);
    };
  } else {
    console.warn("❌ Speech Recognition not supported in this browser.");
  }

  // Image Upload & OCR Chat
  document.getElementById('image-upload').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user");
    messageDiv.textContent = "📷 Sent an image...";
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const response = await fetch("/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const botReply = document.createElement("div");
      botReply.classList.add("message", "bot");
      botReply.textContent = data.reply;
      chatBox.appendChild(botReply);
      chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
      console.error("Image upload error:", error);
      const errorMsg = document.createElement("div");
      errorMsg.classList.add("message", "bot");
      errorMsg.textContent = "❌ Failed to get image reply.";
      chatBox.appendChild(errorMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Clear file input to allow uploading same image again
    event.target.value = "";
  });

  // Toggle profile menu (optional UI function)
  window.toggleProfileMenu = function () {
    const menu = document.getElementById("profileMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };
});
