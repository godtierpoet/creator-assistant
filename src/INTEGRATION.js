// ── HOW TO INTEGRATE AIModelSelector INTO App.jsx ──────────────────────────
//
// 1. Copy these 3 files into your src/ folder:
//      modelData.js
//      ModelTooltip.jsx
//      AIModelSelector.jsx
//
// 2. In App.jsx, add the import at the top:
import AIModelSelector from "./AIModelSelector";
//
// 3. Add this state inside your App() component (near your other useState calls):
const [selectedModel, setSelectedModel] = useState("llama-4-maverick");
//
// 4. Place the selector in the Input Card section, ABOVE the Generate button.
//    Find the "CUSTOM SPECS" block and add this after it:

<div style={{ marginBottom: "18px" }}>
  <AIModelSelector value={selectedModel} onChange={setSelectedModel} />
</div>

// 5. Pass selectedModel to your generate() function.
//    The model IDs map to these API endpoints:
//      llama-4-maverick  → Groq (current, already working)
//      gpt-5, gpt-5-mini → OpenAI API
//      claude-opus-4     → Anthropic API
//      gemini-2-5-pro    → Google Generative AI
//    You can add conditional fetch logic per model.id inside generate().
//
// Example generate() addition:
const MODEL_API_MAP = {
  "llama-4-maverick": {
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    headers: { "Authorization": `Bearer ${GROQ_KEY}` },
  },
  "llama-4-scout": {
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    headers: { "Authorization": `Bearer ${GROQ_KEY}` },
  },
  // Add more as you get API keys
};

// Then inside generate():
const apiConfig = MODEL_API_MAP[selectedModel] || MODEL_API_MAP["llama-4-maverick"];
const res = await fetch(apiConfig.url, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...apiConfig.headers },
  body: JSON.stringify({ model: apiConfig.model, messages: [...] })
});
