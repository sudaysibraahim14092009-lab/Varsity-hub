module.exports = async function handler(req, res) {
  // CORS headers (in case needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Check API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { system, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: system || "You are the Varsity AI Assistant for the Varsity Survival Hub — South Africa's #1 student app. You help SA university students with NSFAS, bursaries, university applications, APS scores, accommodation, textbooks, campus jobs and student wellness. Be clear, practical and encouraging. Use Rands (R) for money. If a student mentions mental health issues, be empathetic and refer them to SADAG (0800 456 789).",
        messages: messages
      })
    });

    const data = await response.json();

    // Log full error from Anthropic if not OK
    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data));
      return res.status(response.status).json({ error: data?.error?.message || 'AI error' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
