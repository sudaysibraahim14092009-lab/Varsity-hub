const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Varsity Hub <onboarding@resend.dev>',
      to: email,
      subject: '🎓 Welcome to Varsity Survival Hub!',
      html: `<h2>Hey ${firstName || 'Student'}! 👋</h2>
             <p>You're now subscribed to Varsity Survival Hub.</p>
             <p>We'll keep you updated on NSFAS, bursaries, and student news!</p>
             <p>🚀 <strong>The Varsity Hub Team</strong></p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
