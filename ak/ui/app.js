const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const promptEl = document.getElementById("prompt");
const micButton = document.getElementById("mic-button");
const ttsToggle = document.getElementById("tts-toggle");
const statusText = document.getElementById("status-text");
const personaSelect = document.getElementById("persona");
const refreshButton = document.getElementById("open-dashboard");
const clearButton = document.getElementById("clear-chat");
const quickButtons = document.querySelectorAll(".quick-button");

let enableSpeech = true;
let recognition;
const conversation = [
  {
    role: "system",
    content:
      "You are AK, a polished local AI assistant. Answer clearly, helpfully, and with a modern tone. Keep responses friendly and concise unless the user requests more detail.",
  },
];

function createMessageBubble(text, role, extraClass = "") {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role} ${extraClass}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  return wrapper;
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderMessage(text, role, status = "") {
  const bubble = createMessageBubble(text, role, status);
  messagesEl.appendChild(bubble);
  scrollToBottom();
}

function updateStatus(text) {
  statusText.textContent = text;
}

function setPersona(role) {
  let prompt;
  switch (role) {
    case "tech":
      prompt = "You are AK, a modern tech expert. Provide precise, high-level technical answers with real-world clarity.";
      break;
    case "creative":
      prompt = "You are AK, a creative assistant. Answer in an imaginative, engaging style with examples and storytelling.";
      break;
    case "concise":
      prompt = "You are AK, a concise expert. Give short, direct responses that stay on point.";
      break;
    case "friendly":
      prompt = "You are AK, a friendly guide. Respond warmly, supportively, and clearly in every answer.";
      break;
    default:
      prompt = "You are AK, a polished local AI assistant. Answer clearly, helpfully, and with a modern tone.";
  }
  conversation[0].content = prompt;
}

function speakText(text) {
  if (!enableSpeech || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

function startVoiceCapture() {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    promptEl.value = text;
    sendPrompt(text);
  };

  recognition.onerror = (event) => {
    alert(`Voice recognition error: ${event.error}`);
  };

  recognition.onend = () => {
    micButton.textContent = "🎙️ Voice";
  };

  micButton.textContent = "Listening...";
  recognition.start();
}

async function loadStatus() {
  try {
    const response = await fetch("/api/models");
    if (!response.ok) {
      updateStatus("Unable to load model status.");
      return;
    }

    const data = await response.json();
    updateStatus(`Mode: ${data.mode} • Engine: ${data.engine} • Local model: ${data.model_path || "none"} • Threads: ${data.threads || "auto"}`);
  } catch (error) {
    updateStatus("Unable to load model status.");
  }
}

async function sendPrompt(prompt) {
  if (!prompt) return;
  conversation.push({ role: "user", content: prompt });
  renderMessage(prompt, "user");
  const thinkingBubble = createMessageBubble("Thinking...", "assistant", "typing");
  messagesEl.appendChild(thinkingBubble);
  scrollToBottom();
  promptEl.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json();
    messagesEl.removeChild(thinkingBubble);

    if (!response.ok || !data.response) {
      renderMessage(`Error: ${data.detail || response.statusText}`, "error");
      return;
    }

    conversation.push({ role: "assistant", content: data.response });
    renderMessage(data.response, "assistant");
    speakText(data.response);
  } catch (error) {
    messagesEl.removeChild(thinkingBubble);
    renderMessage(`Connection failed: ${error.message}`, "error");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = promptEl.value.trim();
  if (!prompt) return;
  sendPrompt(prompt);
});

micButton.addEventListener("click", () => startVoiceCapture());

ttsToggle.addEventListener("click", () => {
  enableSpeech = !enableSpeech;
  ttsToggle.textContent = enableSpeech ? "🔊 Speak" : "🔇 Mute";
});

refreshButton.addEventListener("click", () => loadStatus());

clearButton.addEventListener("click", () => {
  conversation.splice(1);
  messagesEl.innerHTML = "";
  renderMessage("Chat cleared. Ready for a new conversation.", "assistant");
});

personaSelect.addEventListener("change", (event) => {
  setPersona(event.target.value);
  renderMessage(`Persona set to ${event.target.selectedOptions[0].text}.`, "assistant", "meta");
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.dataset.prompt;
    promptEl.value = prompt;
    sendPrompt(prompt);
  });
});

setPersona(personaSelect.value);
renderMessage("Welcome to AK. Ask anything and enjoy a modern local chat experience.", "assistant");
loadStatus();
