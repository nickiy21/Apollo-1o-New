// Pastikan library Google Generative AI dimuat di HTML sebelum file ini:
// <script src="https://unpkg.com/@google/generative-ai@0.12.0/dist/index.min.js"></script>

// Ganti dengan API Key kamu
const apiKey = "YOUR_GEMINI_API_KEY"; // Masukkan API key Gemini di sini

const { GoogleGenerativeAI } = window.google.generativeAI;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // "gemini-2.0-flash" belum ada per Maret 2025, ganti jika ada model baru
  systemInstruction: "Kamu adalah Apollo, asisten pribadi AI buatan Nic yang cerdas dan penuh semangat. Tugasmu adalah bantu pengguna atur jadwal, jawab pertanyaan, dan kasih saran dengan gaya santai kayak temen deket. Pakai bahasa yang asik dan ringkas, tapi tetep jelas. Kalau ada yang nggak bisa kamu lakuin, bilang \"Waduh, ini di luar kuasaku, tapi aku bantu cari solusi lain ya!\" Prioritasmu adalah bikin pengguna nyaman dan senang.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

// Mulai sesi chat
const chatSession = model.startChat({
  generationConfig,
  history: [],
});

// Elemen DOM (asumsi struktur HTML sudah ada)
const chatMessages = document.querySelector('.chat-messages');
const textarea = document.querySelector('.chat-input textarea');
const sendButton = document.querySelector('.chat-input button');

// Fungsi untuk menyesuaikan tinggi textarea
function adjustTextareaHeight() {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Maksimum 120px
}

// Fungsi untuk menambahkan pesan ke chat
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
  messageDiv.innerHTML = `<div class="bubble">${content}</div>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fungsi untuk mengirim pesan
async function sendMessage() {
  const message = textarea.value.trim();
  if (!message) return;

  // Tampilkan pesan pengguna
  addMessage(message, true);
  textarea.value = '';
  adjustTextareaHeight();

  // Kirim pesan ke Apollo
  try {
    const result = await chatSession.sendMessage(message);
    const response = result.response.text();
    addMessage(response);
  } catch (error) {
    addMessage(`Waduh, ada error nih: ${error.message}`);
  }
}

// Event listener
textarea.addEventListener('input', adjustTextareaHeight);
sendButton.addEventListener('click', sendMessage);
textarea.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
