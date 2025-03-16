<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apollo Chatbot</title>
  <style>
    .elcreative_chat_container {
      max-width: 800px;
      margin: 0 auto 20px;
      padding: 10px;
    }
    .elcreative_chat_input_container.flex {
      display: flex;
      min-height: 58px;
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      border: 1px solid #1E40AF;
      background-color: white;
      padding: 8px;
      transition: box-shadow 0.2s;
    }
    .elcreative_chat_input_container.flex:focus-within {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .elcreative_chat_input_container textarea {
      width: 100%;
      resize: none;
      border: none;
      background: transparent;
      padding: 6px 8px;
      outline: none;
      font-size: 16px;
      color: black;
    }
    .elcreative_chat_input_container button {
      cursor: pointer;
      border-radius: 9999px;
      background-color: #1E40AF;
      padding: 8px;
      color: white;
      border: none;
      transition: box-shadow 0.2s;
    }
    .elcreative_chat_input_container button:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .chat_prompt {
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
    }
    .chat_prompt div.bg-blue-700\/20 {
      background-color: rgba(30, 64, 175, 0.2);
      border-radius: 0 0 8px 8px;
      padding: 12px;
    }
    .chat_answer {
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
    .chat_answer div.bg-black\/10 {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 8px 8px 8px 0;
      padding: 12px;
      width: 100%;
    }
    .text-xs {
      font-size: 12px;
      color: #6B7280;
    }
    .text-center {
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="chat-container">
    <div class="elcreative_chat_container"></div>
    <div class="elcreative_chat_input_container flex">
      <textarea rows="1" placeholder="Apa yang bisa Apollo bantu hari ini?"></textarea>
      <button aria-label="Kirim" title="Kirim">
        <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
        </svg>
      </button>
    </div>
    <div class="text-xs text-center mt-2 text-gray-500">
      Apollo by <strong>Nic</strong>.
    </div>
  </div>

  <script src="https://unpkg.com/@google/generative-ai@0.12.0/dist/index.min.js"></script>
  <script>
    // Ganti dengan API Key kamu
    const apiKey = "YOUR_GEMINI_API_KEY"; // Masukkan API key di sini

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "Kamu adalah Apollo, asisten pribadi AI buatan Nic yang cerdas dan penuh semangat. Tugasmu adalah bantu pengguna atur jadwal, jawab pertanyaan, dan kasih saran dengan gaya santai kayak temen deket. Pakai bahasa yang asik dan ringkas, tapi tetep jelas. Kalau ada yang nggak bisa kamu lakuin, bilang \"Waduh, ini di luar kuasaku, tapi aku bantu cari solusi lain ya!\" Prioritasmu adalah bikin pengguna nyaman dan senang.",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1000,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const chatContainer = document.querySelector('.elcreative_chat_container');
    const textarea = document.querySelector('textarea');
    const sendBtn = document.querySelector('button');

    // Fungsi untuk menyesuaikan tinggi textarea
    function adjustTextareaHeight() {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    // Event listener untuk input textarea
    textarea.addEventListener('input', adjustTextareaHeight);

    // Fungsi untuk mengirim pesan
    async function sendMessage() {
      const message = textarea.value.trim();
      if (!message) return;

      // Tampilkan pesan pengguna
      chatContainer.innerHTML += `
        <div class="chat_prompt">
          <div></div>
          <div class="flex flex-col items-end justify-center rounded-b-lg rounded-tl-lg bg-blue-700/20 px-3">
            <div class="w-auto">
              <p>${message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
          </div>
        </div>
      `;
      textarea.value = '';
      adjustTextareaHeight();
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Kirim pesan ke Apollo
      try {
        const result = await chatSession.sendMessage(message);
        const response = result.response.text();
        chatContainer.innerHTML += `
          <div class="chat_answer">
            <div class="flex w-full flex-col items-end justify-center rounded-b-lg rounded-tr-lg bg-black/10 px-3">
              <div class="w-full">${response}</div>
            </div>
          </div>
        `;
      } catch (error) {
        chatContainer.innerHTML += `
          <div class="chat_answer">
            <div class="flex w-full flex-col items-end justify-center rounded-b-lg rounded-tr-lg bg-black/10 px-3">
              <div class="w-full">Waduh, ada error nih: ${error.message}</div>
            </div>
          </div>
        `;
      }
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Event listener untuk tombol kirim
    sendBtn.addEventListener('click', sendMessage);

    // Event listener untuk tombol Enter
    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  </script>
</body>
</html>
