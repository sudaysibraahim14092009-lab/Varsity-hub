export async function onRequestPost(context) {
  const env = context.env;
  const { email, firstName } = await context.request.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'ScholrZA <onboarding@resend.dev>',
        to: email,
        subject: '🎓 Welcome to ScholrZA!',
        html: `<h2>Hey ${firstName || 'Student'}! 👋</h2><p>You're now subscribed to ScholrZA.</p><p>We'll keep you updated on NSFAS, bursaries, and student news!</p><p>🚀 <strong>The ScholrZA Team</strong></p>`
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'Failed to send email: ' + err }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    }

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error: ' + err.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  }
}
