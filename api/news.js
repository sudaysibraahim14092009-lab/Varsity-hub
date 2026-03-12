export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 's-maxage=300, stale-while-revalidate',
  };

  const FEEDS = [
    // SA General
    { url: 'https://feeds.news24.com/articles/news24/TopStories/rss', source: 'News24' },
    { url: 'https://feeds.news24.com/articles/news24/SouthAfrica/rss', source: 'News24 SA' },
    { url: 'https://feeds.news24.com/articles/news24/Politics/rss', source: 'News24 Politics' },
    { url: 'https://feeds.news24.com/articles/news24/Money/rss', source: 'News24 Money' },
    { url: 'https://www.dailymaverick.co.za/feed/', source: 'Daily Maverick' },
    { url: 'https://www.groundup.org.za/feed/', source: 'GroundUp' },
    { url: 'https://www.iol.co.za/rss', source: 'IOL' },
    { url: 'https://www.iol.co.za/education/rss', source: 'IOL Education' },
    { url: 'https://www.timeslive.co.za/rss/', source: 'Times Live' },
    { url: 'https://www.sowetanlive.co.za/rss/', source: 'Sowetan' },
    { url: 'https://www.heraldlive.co.za/rss/', source: 'Herald Live' },
    { url: 'https://www.dispatchlive.co.za/rss/', source: 'Dispatch Live' },
    { url: 'https://www.citizen.co.za/feed/', source: 'The Citizen' },
    { url: 'https://ewn.co.za/RSS', source: 'EWN' },
    { url: 'https://www.sabc.co.za/sabc/feed/', source: 'SABC News' },
    { url: 'https://www.dailysun.co.za/rss/', source: 'Daily Sun' },
    { url: 'https://www.sabcnews.com/sabcnews/feed/', source: 'SABC News 2' },
    { url: 'https://www.news.uct.ac.za/rss/', source: 'UCT News' },
    { url: 'https://www.up.ac.za/rss', source: 'UP News' },
    { url: 'https://www.wits.ac.za/news/rss/', source: 'Wits News' },
    // Education
    { url: 'https://www.universityworldnews.com/rss.php', source: 'University World News' },
    { url: 'https://theconversation.com/africa/articles.atom', source: 'The Conversation Africa' },
    { url: 'https://theconversation.com/education/articles.atom', source: 'The Conversation Education' },
    { url: 'https://www.bizcommunity.com/rss/196/1.rss', source: 'BizCommunity Education' },
    { url: 'https://feeds.feedburner.com/edutopia/LsTs', source: 'Edutopia' },
    { url: 'https://campustechnology.com/rss-feeds/all-articles.aspx', source: 'Campus Technology' },
    { url: 'https://monitor.icef.com/feed/', source: 'ICEF Monitor' },
    { url: 'https://www.insidehighered.com/rss/all', source: 'Inside Higher Ed' },
    { url: 'https://www.timeshighereducation.com/feed', source: 'Times Higher Education' },
    { url: 'https://www.educationworld.com/rss/news.xml', source: 'Education World' },
    // Youth, Jobs & Finance
    { url: 'https://youthvillage.co.za/feed/', source: 'Youth Village' },
    { url: 'https://www.careers24.com/rss/', source: 'Careers24' },
    { url: 'https://www.pnet.co.za/rss/', source: 'PNet Jobs' },
    { url: 'https://www.fin24.com/rss/', source: 'Fin24' },
    { url: 'https://businesstech.co.za/news/feed/', source: 'BusinessTech' },
    { url: 'https://www.moneyweb.co.za/feed/', source: 'Moneyweb' },
    { url: 'https://learnerships.co.za/feed/', source: 'Learnerships SA' },
    { url: 'https://www.jobsacademy.co.za/feed/', source: 'Jobs Academy' },
    { url: 'https://southafrica.youth4work.com/feed', source: 'Youth4Work SA' },
    // Tech & Innovation
    { url: 'https://mybroadband.co.za/news/feed', source: 'MyBroadband' },
    { url: 'https://techcentral.co.za/feed', source: 'TechCentral' },
    { url: 'https://ventureburn.com/feed/', source: 'VentureBurn' },
    { url: 'https://disrupt-africa.com/feed/', source: 'Disrupt Africa' },
    { url: 'https://www.itweb.co.za/rss', source: 'ITWeb' },
    // Africa
    { url: 'https://allafrica.com/tools/headlines/rdf/southafrica/headlines.rdf', source: 'AllAfrica SA' },
    { url: 'https://www.theafricareport.com/feed/', source: 'The Africa Report' },
    { url: 'https://mg.co.za/rss/', source: 'Mail & Guardian' },
    // Government & Policy
    { url: 'https://www.gov.za/rss.xml', source: 'SA Government' },
    { url: 'https://www.parliament.gov.za/rss', source: 'Parliament SA' },
    { url: 'https://www.dhet.gov.za/rss', source: 'DHET' },
    // Health & Wellness
    { url: 'https://health24.com/rss/', source: 'Health24' },
    { url: 'https://www.dailymaverick.co.za/section/maverick-citizen/feed/', source: 'Maverick Citizen' },
  ];

  function parseRSS(xml, source) {
    const articles = [];
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
      const title = get('title').replace(/<[^>]+>/g, '')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&#039;/g,"'").replace(/&quot;/g,'"').trim();
      const link = get('link') || getAttr('link', 'href');
      const description = get('description') || get('summary') || get('content') || '';
      const clean = description.replace(/<[^>]+>/g, '')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
        .replace(/&#039;/g,"'").replace(/&quot;/g,'"')
        .replace(/\s+/g,' ').trim().slice(0, 1500);
      const pubDate = get('pubDate') || get('published') || get('updated') || new Date().toISOString();
      const imgMatch = block.match(/url="([^"]*\.(jpg|jpeg|png|webp)[^"]*)"/i)
        || block.match(/<media:thumbnail[^>]*url="([^"]*)"/i)
        || block.match(/<enclosure[^>]*url="([^"]*\.(jpg|jpeg|png)[^"]*)"/i)
        || description.match(/<img[^>]*src="([^"]*)"/i);
      const image = imgMatch ? imgMatch[1] : null;
      const wordCount = clean.split(' ').length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      if (title && link) {
        articles.push({ title, description: clean, url: link, image, publishedAt: pubDate, source, content: clean, readTime });
      }
    }
    return articles;
  }

  function injectAds(articles) {
    const ADS = [
      {
        title: "📚 Get Your Matric Past Papers — Free Download",
        description: "Download 10 years of NSC past papers for all subjects. Mathematics, Physical Sciences, Life Sciences, English, Accounting and more. All free on ScholrZA. No login required.",
        url: "https://scholrza.pages.dev",
        image: null, publishedAt: new Date().toISOString(),
        source: "ScholrZA", isAd: true, adLabel: "From ScholrZA", readTime: 1
      },
      {
        title: "🎓 Check Your APS Score Instantly",
        description: "Use the free ScholrZA APS Calculator to see exactly which universities and programmes you qualify for. All 26 SA public universities included. Takes 2 minutes. No signup needed.",
        url: "https://scholrza.pages.dev",
        image: null, publishedAt: new Date().toISOString(),
        source: "ScholrZA", isAd: true, adLabel: "From ScholrZA", readTime: 1
      },
      {
        title: "💳 NSFAS Applications — Everything You Need to Know",
        description: "Step-by-step guide to applying for NSFAS, checking your status and appealing a rejection. Covers all 26 SA universities. Completely free on ScholrZA.",
        url: "https://scholrza.pages.dev",
        image: null, publishedAt: new Date().toISOString(),
        source: "ScholrZA", isAd: true, adLabel: "From ScholrZA", readTime: 1
      },
      {
        title: "🏆 Bursaries Still Open — Apply Before It's Too Late",
        description: "Hundreds of bursaries available for SA students in 2026. ScholrZA lists all open bursaries with deadlines, amounts and how to apply. Updated regularly. 100% free.",
        url: "https://scholrza.pages.dev",
        image: null, publishedAt: new Date().toISOString(),
        source: "ScholrZA", isAd: true, adLabel: "From ScholrZA", readTime: 1
      },
      {
        title: "🏠 Find Student Accommodation Near Your University",
        description: "Looking for a place to stay? ScholrZA lists affordable student accommodation options near all 26 SA universities. Private and on-campus options included.",
        url: "https://scholrza.pages.dev",
        image: null, publishedAt: new Date().toISOString(),
        source: "ScholrZA", isAd: true, adLabel: "From ScholrZA", readTime: 1
      },
    ];

    const result = [];
    let adIndex = 0;
    for (let i = 0; i < articles.length; i++) {
      result.push(articles[i]);
      if ((i + 1) % 8 === 0 && adIndex < ADS.length) {
        result.push(ADS[adIndex++ % ADS.length]);
      }
    }
    return result;
  }

  try {
    const results = await Promise.allSettled(
      FEEDS.map(f =>
        fetch(f.url, {
          headers: { 'User-Agent': 'ScholrZA/1.0 (scholrza.pages.dev)' },
          signal: AbortSignal.timeout(7000)
        })
        .then(r => r.text())
        .then(xml => parseRSS(xml, f.source))
        .catch(() => [])
      )
    );

    let articles = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

    const seen = new Set();
    articles = articles.filter(a => {
      const key = a.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const KEYWORDS = ['student','university','nsfas','bursary','education','campus',
      'graduate','matric','varsity','tvet','college','fees','academic','degree',
      'scholarship','youth','employment','job','internship','sassa','allowance',
      'residence','accommodation','study','exam','results','admission','apply',
      'application','funding','financial aid','stipend','learnerships','artisan',
      'apprentice','skills','career','diploma','certificate','higher','school',
      'learner','teacher','lecturer','research','science','maths','mathematics',
      'biology','chemistry','physics','accounting','history','geography','english'];

    const relevant = articles.filter(a => {
      const text = (a.title + ' ' + a.description).toLowerCase();
      return KEYWORDS.some(k => text.includes(k));
    });

    const final = relevant.length >= 10 ? relevant : articles;
    final.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const withAds = injectAds(final.slice(0, 200));

    return new Response(JSON.stringify({ articles: withAds, total: withAds.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ articles: [] }), { status: 200, headers: corsHeaders });
  }
}
