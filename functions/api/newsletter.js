export async function onRequestPost(context) {
  const env = context.env;
  const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  let email, firstName;
  try {
    const body = await context.request.json();
    email = body.email;
    firstName = body.firstName || body.name || '';
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: cors });
  }

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: cors });
  }

  // 1. Save to Supabase
  const dbRes = await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ email, name: firstName })
  });

  if (!dbRes.ok) {
    const err = await dbRes.text();
    if (err.includes('unique')) {
      return new Response(JSON.stringify({ error: 'Already subscribed' }), { status: 409, headers: cors });
    }
    return new Response(JSON.stringify({ error: 'Failed to save subscriber' }), { status: 500, headers: cors });
  }

  // 2. Send welcome email via Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'ScholrZA <onboarding@resend.dev>',
      to: email,
      subject: '🎓 Welcome to ScholrZA!',
      html: `<h2>Hey ${firstName || 'Student'}! 👋</h2>
             <p>You're now subscribed to ScholrZA.</p>
             <p>We'll keep you updated on NSFAS deadlines, new bursaries, and student news — straight to your inbox.</p>
             <p>🚀 <strong>The ScholrZA Team</strong></p>`
    })
  });

  return new Response(JSON.stringify({ success: true }), { headers: cors });
}
