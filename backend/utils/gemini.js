// Fetch-based Gemini (Generative Language) client
// Auto-detects available API version and model; supports optional GEMINI_MODEL override.

let cachedModel = null; // cache resolved model for runtime
let cachedApiVersion = null; // 'v1' or 'v1beta'

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not set');
  return key;
}

async function listModels() {
  const key = getApiKey();
  // Try v1 first
  const tryFetch = async (url) => {
    const resp = await fetch(url);
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`${resp.status} ${resp.statusText}: ${txt}`);
    }
    return resp.json();
  };
  try {
    const data = await tryFetch(`https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(key)}`);
    cachedApiVersion = 'v1';
    return data?.models || [];
  } catch (_) {
    const data = await tryFetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
    cachedApiVersion = 'v1beta';
    return data?.models || [];
  }
}

function pickModel(models) {
  // If user specified a model, prefer it if present; otherwise pick a common one that supports generateContent
  const prefer = (process.env.GEMINI_MODEL?.trim()) || '';
  const supportsGen = (m) => Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods.includes('generateContent') : true;

  const byName = (name) => models.find(m => (m.name?.endsWith(name) || m.name === name) && supportsGen(m));

  if (prefer) {
    const found = byName(prefer) || models.find(m => (m.displayName === prefer));
    if (found) return found.name;
  }

  const candidates = [
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-latest',
    'models/gemini-1.5-flash-8b',
    'models/gemini-1.5-pro',
    'models/gemini-1.0-pro',
    'models/gemini-pro'
  ];
  for (const c of candidates) {
    const m = byName(c.replace(/^models\//, '')) || models.find(x => x.name === c);
    if (m && supportsGen(m)) return m.name;
  }

  // Fallback to first that supports generateContent
  const any = models.find(supportsGen);
  if (any) return any.name;
  throw new Error('No suitable Gemini model found for generateContent');
}

async function ensureModel() {
  if (cachedModel && cachedApiVersion) return { model: cachedModel, api: cachedApiVersion };
  const models = await listModels();
  const chosen = pickModel(models);
  cachedModel = chosen; // already includes `models/` prefix
  return { model: cachedModel, api: cachedApiVersion };
}

export async function getGeminiStatus() {
  const models = await listModels();
  const { model, api } = await ensureModel();
  return {
    apiVersion: api,
    resolvedModel: model,
    sampleModels: models.slice(0, 25).map(m => m.name)
  };
}

async function callGenerate(systemPrompt) {
  const key = getApiKey();
  const { model, api } = await ensureModel();
  // Do NOT encode the model path; Google expects "v1/models/<id>:generateContent"
  const url = `https://generativelanguage.googleapis.com/${api}/${model}:generateContent?key=${encodeURIComponent(key)}`;
  console.log(`[Gemini] Using API=${api} model=${model}`);
  const body = {
    contents: [
      { role: 'user', parts: [{ text: String(systemPrompt) }] }
    ]
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`${resp.status} ${resp.statusText}: ${text}`);
  }
  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  if (!text) throw new Error('Empty response text');
  return text;
}

export async function generateBlogContent(prompt) {
  console.log('🤖 Generating content for prompt:', String(prompt).slice(0, 80));
  const text = await callGenerate(prompt);
  console.log('✅ AI Generated Content Successfully');
  return text;
}

export async function generateBlogIdeas(topic) {
  const ideaPrompt = `Generate 10 creative and engaging blog post ideas related to: "${topic}".\nFormat each idea as:\n1. [Title] - [Brief description]\nMake them diverse, interesting, and suitable for different audiences.`;
  return callGenerate(ideaPrompt);
}
