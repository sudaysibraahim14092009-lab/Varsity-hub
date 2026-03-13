export async function onRequestPost(context) {
  const env = context.env;
  const { email } = await context.request.json();
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  }
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': env.SUPABASE_ANON_KEY, 'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.text();
    if (err.includes('unique')) return new Response(JSON.stringify({ error: 'Already subscribed' }), { status: 409, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  }
  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
}
