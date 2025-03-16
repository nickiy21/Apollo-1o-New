const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
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

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage("babi kau");
  console.log(result.response.text());
}

run();
