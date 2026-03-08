module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.EMAILOCTOPUS_API_KEY,
          email_address: email,
          fields: { FirstName: firstName || '' },
          status: 'subscribed',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || 'Signup failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
      }
