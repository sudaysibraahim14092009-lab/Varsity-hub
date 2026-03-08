module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const queries = [
    'NSFAS South Africa 2025',
    'South Africa university students bursaries',
    'South Africa higher education',
    'SA student campus news',
    'graduate jobs internships South Africa'
  ];

  const randomQuery = queries[Math.floor(Math.random() * queries.length)];

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(randomQuery)}&lang=en&country=za&max=10&apikey=${process.env.GNEWS_API_KEY}`
    );
    const data = await response.json();

    if (!response.ok || !data.articles) {
      return res.status(500).json({ error: 'Failed to fetch news' });
    }

    const articles = data.articles.map(a => ({
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt,
      source: a.source?.name || 'Unknown'
    }));

    return res.status(200).json({ articles });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
};
