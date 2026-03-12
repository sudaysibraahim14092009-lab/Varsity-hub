export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { system, messages } = await context.request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400, headers: corsHeaders });
    }

    const GROQ_API_KEY = context.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: corsHeaders });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: system || "You are ScholrBot, the AI assistant for ScholrZA — South Africa's #1 free student platform. Answer ANY question a student asks — not just student topics. Specialise in NSFAS, bursaries, past papers, APS scores, all 26 SA universities, accommodation, jobs, learnerships and study help for all subjects. Be friendly, practical and encouraging. Use Rands (R) for money. For Maths/Science show full step-by-step working. For mental health refer to SADAG 0800 456 789. NEVER repeat the same intro or offer the same quick links every message." },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message || 'Groq error' }), { status: response.status, headers: corsHeaders });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ content: [{ type: 'text', text: reply }] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
