document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const micBtn = document.getElementById("mic-btn");

  // Function to send message
  async function sendMessage(message) {
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

      // Show bot reply
      chatBox.innerHTML += `<div class="message bot">${data.reply}</div>`;

      // ✅ Speak reply
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'en-IN'; // or 'hi-IN' for Hindi
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }

      // Scroll to bottom
      chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
      chatBox.innerHTML += `<div class="message bot">Error: Could not get response.</div>`;
      console.error("Fetch error:", error);
    }
  }

  // 🔘 Send on send-button click
  sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    sendMessage(message);
  });

  // 🎙️ Voice recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onstart = () => {
      micBtn.style.color = "red"; // Indicate it's listening
    };

    recognition.onend = () => {
      micBtn.style.color = ""; // Reset color when done
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      userInput.value = voiceText;
      sendMessage(voiceText);
    };
  } else {
    console.warn("Speech Recognition not supported in this browser.");
  }
});
