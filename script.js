


// Select DOM Elements
const domElements = {
  prompt: document.querySelector("#prompt"),
  submitBtn: document.querySelector("#submit"),
  chatContainer: document.querySelector(".chat-container"),
  imageBtn: document.querySelector("#image"),
  image: document.querySelector("#image img"),
  imageInput: document.querySelector("#image input"),
  voiceBtn: document.querySelector("#voice"),
  stopVoiceBtn: document.createElement("button"),
};

domElements.stopVoiceBtn.textContent = "Stop Voice";
domElements.stopVoiceBtn.id = "stop-voice";
domElements.stopVoiceBtn.style.display = "none";
domElements.voiceBtn.insertAdjacentElement("afterend", domElements.stopVoiceBtn);

// API URL and User Data
const apiConfig = {
  url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBbF_FmmotXRUl1FCG0E2QkDd3S_mWNzEw",
};

const userData = {
  message: null,
  file: { mime_type: null, data: null },
};

// Speech Recognition and Synthesis Instances
let recognition = null;
let speechUtterance = null;

// Function to Stop AI Speech
function stopAISpeech() {
  if (speechUtterance) {
    speechSynthesis.cancel();
    speechUtterance = null;
  }
}

// Function to Convert AI Text to Speech
function speakText(text) {
  if (!text) return;
  stopAISpeech();
  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = "en-US";
  speechUtterance.rate = 1;
  speechUtterance.pitch = 1;
  speechSynthesis.speak(speechUtterance);
}

// Function to Generate AI Response
async function generateResponse(aiChatBox) {
  const textElement = aiChatBox.querySelector(".ai-chat-area");

  const requestBody = { contents: [{ parts: [{ text: userData.message }] }] };
  if (userData.file.data) {
    requestBody.contents[0].parts.push({ inline_data: userData.file });
  }

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(apiConfig.url, requestOptions);
    const data = await response.json();
    const apiResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "⚠️ AI Response Unavailable";

    textElement.innerHTML = apiResponse;
    stopVoiceRecognition();
    speakText(apiResponse);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    textElement.innerHTML = "⚠️ Error generating response. Try again.";
  } finally {
    domElements.chatContainer.scrollTo({ top: domElements.chatContainer.scrollHeight, behavior: "smooth" });
    resetImage();
  }
}

// Function to Stop Voice Recognition
function stopVoiceRecognition() {
  if (recognition) {
    recognition.stop();
    domElements.stopVoiceBtn.style.display = "none";
    recognition = null;
  }
}

// Function to Start Voice Recognition
function startVoiceRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  stopAISpeech();

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.start();
  domElements.stopVoiceBtn.style.display = "inline-block";

  recognition.onstart = () => domElements.voiceBtn.classList.add("listening");
  recognition.onresult = (event) => {
    domElements.prompt.value = event.results[0][0].transcript;
    handleChatResponse(domElements.prompt.value);
  };
  recognition.onerror = () => alert("Voice recognition error. Try again.");
  recognition.onend = () => {
    domElements.voiceBtn.classList.remove("listening");
    domElements.stopVoiceBtn.style.display = "none";
  };
}

// Function to Handle User Chat Submission
function handleChatResponse(userMessage) {
  if (!userMessage.trim()) return;
  userData.message = userMessage;

  const userChatHtml = `<div class="user-chat-box">
    <img src="user.png" alt="User " width="8%">
    <div class="user-chat-area">${userMessage}</div>
  </div>`;

  domElements.chatContainer.appendChild(createChatBox(userChatHtml, "user-chat-box"));
  domElements.chatContainer.scrollTo({ top: domElements.chatContainer.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    const aiChatHtml = `<div class="ai-chat-box">
      <img src=" ai.png" alt="AI" width="10%">
      <div class="ai-chat-area">
        <img src="loading.webp" alt="Loading" class="load" width="50px">
      </div>
    </div>`;

    const aiChatBox = createChatBox(aiChatHtml, "ai-chat-box");
    domElements.chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);

  domElements.prompt.value = "";
}

// Function to Create Chat Box Elements
function createChatBox(html, classes) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Function to Reset Image Selection
function resetImage() {
  domElements.image.src = `img.svg`;
  domElements.image.classList.remove("choose");
  userData.file = { mime_type: null, data: null };
}

// Event Listeners
domElements.prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleChatResponse(domElements.prompt.value);
});
domElements.submitBtn.addEventListener("click", () => handleChatResponse(domElements.prompt.value));
domElements.voiceBtn.addEventListener("click", startVoiceRecognition);
domElements.stopVoiceBtn.addEventListener("click", stopVoiceRecognition);

// for female voice 
domElements.voiceBtn.addEventListener("click", () => {
  domElements.voiceBtn.classList.remove("active");
  domElements.stopVoiceBtn.classList.add("active");
  speechSynthesis.speak(new SpeechSynthesisUtterance("Hello, I'm a chatbot!"));
  domElements.stopVoiceBtn.style.display = "inline-block";
  domElements.voiceBtn.style.display = "none";
});

// for stop ce button 
domElemetns.stopVoiceBtn.style.display = "Block";

stopVoiceBtn.addElementListner()("click",function(e){
   stopAISpeech();
    toggleButtonVisibility(stopVoiceBtn, voiceBtn);
})
