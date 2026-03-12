export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  // Free SA news RSS feeds — no API key needed
  const FEEDS = [
    { url: 'https://feeds.news24.com/articles/news24/TopStories/rss', source: 'News24' },
    { url: 'https://www.dailymaverick.co.za/feed/', source: 'Daily Maverick' },
    { url: 'https://theconversation.com/africa/articles.atom', source: 'The Conversation' },
    { url: 'https://www.groundup.org.za/feed/', source: 'GroundUp' },
  ];

  function parseRSS(xml, source) {
    const articles = [];
    // Match both RSS <item> and Atom <entry>
    const itemRegex = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const get = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
        return m ? m[1].trim() : '';
      };
      const getAttr = (tag, attr) => {
        const m = block.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'));
        return m ? m[1] : '';
      };
      const title = get('title').replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#039;/g,"'").replace(/&quot;/g,'"');
      const link = get('link') || getAttr('link', 'href');
      const description = get('description') || get('summary') || get('content');
      const clean = description.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#039;/g,"'").replace(/&quot;/g,'"').slice(0, 200);
      const pubDate = get('pubDate') || get('published') || get('updated') || new Date().toISOString();
      // Try to extract image
      const imgMatch = block.match(/url="([^"]*\.(jpg|jpeg|png|webp)[^"]*)"/i)
        || block.match(/<media:thumbnail[^>]*url="([^"]*)"/i)
        || block.match(/<enclosure[^>]*url="([^"]*\.(jpg|jpeg|png)[^"]*)"/i)
        || description.match(/<img[^>]*src="([^"]*)"/i);
      const image = imgMatch ? imgMatch[1] : null;

      if (title && link) {
        articles.push({ title, description: clean, url: link, image, publishedAt: pubDate, source, content: clean });
      }
    }
    return articles;
  }

  try {
    const results = await Promise.allSettled(
      FEEDS.map(f =>
        fetch(f.url, {
          headers: { 'User-Agent': 'ScholrNews/1.0' },
          signal: AbortSignal.timeout(5000)
        })
        .then(r => r.text())
        .then(xml => parseRSS(xml, f.source))
        .catch(() => [])
      )
    );

    let articles = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

    // Filter for student-relevant content
    const KEYWORDS = ['student','university','nsfas','bursary','education','campus','graduate','matric','varsity','tvet','college','fees','academic','degree','scholarship','youth','employment','job'];
    const relevant = articles.filter(a => {
      const text = (a.title + ' ' + a.description).toLowerCase();
      return KEYWORDS.some(k => text.includes(k));
    });

    // Use relevant if we have enough, otherwise use all
    const final = relevant.length >= 5 ? relevant : articles;

    // Sort by date, newest first
    final.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return res.status(200).json({ articles: final.slice(0, 20) });

  } catch (err) {
    console.error('RSS fetch error:', err);
    return res.status(200).json({ articles: [] });
  }
}
