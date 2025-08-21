let GoogleGenerativeAI = null;

async function ensureClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!GoogleGenerativeAI) {
    try {
      ({ GoogleGenerativeAI } = require('@google/generative-ai'));
    } catch (e) {
      return null;
    }
  }
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return client.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

function localFallback(prompt) {
  const lower = (prompt || '').toLowerCase();
  if (lower.includes('book')) {
    return [
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884' },
      { title: 'Refactoring', author: 'Martin Fowler', isbn: '9780201485677' },
      { title: 'Design Patterns', author: 'Erich Gamma', isbn: '9780201633610' },
    ];
  }
  if (lower.includes('user')) {
    return [
      { name: 'Alice Front', email: 'alice@example.com', role: 'Frontend' },
      { name: 'Bob Back', email: 'bob@example.com', role: 'Backend' },
      { name: 'Quinn QA', email: 'quinn@example.com', role: 'QA' },
    ];
  }
  return { ok: true };
}

async function generateJsonMock(prompt) {
  const model = await ensureClient();
  if (!model) {
    return localFallback(prompt);
  }
  try {
    const systemPrompt = 'Only return valid JSON. No explanations.';
    const res = await model.generateContent(`${systemPrompt}\n\n${prompt || ''}`);
    const text = res.response.text();
    const jsonMatch = text.match(/```json[\s\S]*?```/i);
    const jsonString = jsonMatch ? jsonMatch[0].replace(/```json|```/gi, '').trim() : text.trim();
    return JSON.parse(jsonString);
  } catch (err) {
    // Fallback if API key invalid or network error
    return localFallback(prompt);
  }
}

module.exports = { generateJsonMock };


