export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 's-maxage=300, stale-while-revalidate',
  };

  const FEEDS = [
    // ═══ SA GENERAL ═══
    { url: 'https://feeds.news24.com/articles/news24/TopStories/rss', source: 'News24' },
    { url: 'https://feeds.news24.com/articles/news24/SouthAfrica/rss', source: 'News24 SA' },
    { url: 'https://feeds.news24.com/articles/news24/Politics/rss', source: 'News24 Politics' },
    { url: 'https://feeds.news24.com/articles/news24/Money/rss', source: 'News24 Money' },
    { url: 'https://feeds.news24.com/articles/news24/Tech/rss', source: 'News24 Tech' },
    { url: 'https://feeds.news24.com/articles/news24/Entertainment/rss', source: 'News24 Entertainment' },
    { url: 'https://feeds.news24.com/articles/news24/Lifestyle/rss', source: 'News24 Lifestyle' },
    { url: 'https://feeds.news24.com/articles/news24/Health/rss', source: 'News24 Health' },
    { url: 'https://feeds.news24.com/articles/news24/Africa/rss', source: 'News24 Africa' },
    { url: 'https://feeds.news24.com/articles/news24/World/rss', source: 'News24 World' },
    { url: 'https://feeds.news24.com/articles/news24/Science/rss', source: 'News24 Science' },
    { url: 'https://www.dailymaverick.co.za/feed/', source: 'Daily Maverick' },
    { url: 'https://www.dailymaverick.co.za/section/maverick-citizen/feed/', source: 'Maverick Citizen' },
    { url: 'https://www.dailymaverick.co.za/section/opinionista/feed/', source: 'DM Opinion' },
    { url: 'https://www.dailymaverick.co.za/section/maverick-life/feed/', source: 'Maverick Life' },
    { url: 'https://www.dailymaverick.co.za/section/africa/feed/', source: 'DM Africa' },
    { url: 'https://www.dailymaverick.co.za/section/maverick-business/feed/', source: 'DM Business' },
    { url: 'https://www.groundup.org.za/feed/', source: 'GroundUp' },
    { url: 'https://www.iol.co.za/rss', source: 'IOL' },
    { url: 'https://www.iol.co.za/education/rss', source: 'IOL Education' },
    { url: 'https://www.iol.co.za/personal-finance/rss', source: 'IOL Finance' },
    { url: 'https://www.iol.co.za/lifestyle/rss', source: 'IOL Lifestyle' },
    { url: 'https://www.iol.co.za/technology/rss', source: 'IOL Technology' },
    { url: 'https://www.iol.co.za/business-report/rss', source: 'IOL Business' },
    { url: 'https://www.iol.co.za/travel/rss', source: 'IOL Travel' },
    { url: 'https://www.timeslive.co.za/rss/', source: 'Times Live' },
    { url: 'https://www.sowetanlive.co.za/rss/', source: 'Sowetan' },
    { url: 'https://www.heraldlive.co.za/rss/', source: 'Herald Live' },
    { url: 'https://www.dispatchlive.co.za/rss/', source: 'Dispatch Live' },
    { url: 'https://www.citizen.co.za/feed/', source: 'The Citizen' },
    { url: 'https://www.citizen.co.za/category/news/feed/', source: 'The Citizen News' },
    { url: 'https://www.citizen.co.za/category/business-tech/feed/', source: 'The Citizen Business' },
    { url: 'https://ewn.co.za/RSS', source: 'EWN' },
    { url: 'https://www.sabc.co.za/sabc/feed/', source: 'SABC News' },
    { url: 'https://www.sabcnews.com/sabcnews/feed/', source: 'SABC News 2' },
    { url: 'https://www.dailysun.co.za/rss/', source: 'Daily Sun' },
    { url: 'https://mg.co.za/rss/', source: 'Mail & Guardian' },
    { url: 'https://mg.co.za/education/rss/', source: 'M&G Education' },
    { url: 'https://mg.co.za/politics/rss/', source: 'M&G Politics' },
    { url: 'https://www.politicsweb.co.za/rss', source: 'Politicsweb' },
    { url: 'https://www.capetalk.co.za/rss', source: 'Cape Talk' },
    { url: 'https://www.702.co.za/rss', source: '702' },
    { url: 'https://www.netwerk24.com/rss', source: 'Netwerk24' },
    { url: 'https://www.rapport.co.za/rss/', source: 'Rapport' },
    { url: 'https://www.volksblad.com/rss/', source: 'Volksblad' },
    { url: 'https://www.dieburger.com/rss/', source: 'Die Burger' },
    { url: 'https://www.beeld.com/rss/', source: 'Beeld' },
    // ═══ EDUCATION ═══
    { url: 'https://www.universityworldnews.com/rss.php', source: 'University World News' },
    { url: 'https://theconversation.com/africa/articles.atom', source: 'The Conversation Africa' },
    { url: 'https://theconversation.com/education/articles.atom', source: 'The Conversation Education' },
    { url: 'https://theconversation.com/technology/articles.atom', source: 'The Conversation Tech' },
    { url: 'https://theconversation.com/health/articles.atom', source: 'The Conversation Health' },
    { url: 'https://theconversation.com/politics/articles.atom', source: 'The Conversation Politics' },
    { url: 'https://theconversation.com/business/articles.atom', source: 'The Conversation Business' },
    { url: 'https://theconversation.com/science/articles.atom', source: 'The Conversation Science' },
    { url: 'https://www.bizcommunity.com/rss/196/1.rss', source: 'BizCommunity Education' },
    { url: 'https://feeds.feedburner.com/edutopia/LsTs', source: 'Edutopia' },
    { url: 'https://campustechnology.com/rss-feeds/all-articles.aspx', source: 'Campus Technology' },
    { url: 'https://monitor.icef.com/feed/', source: 'ICEF Monitor' },
    { url: 'https://www.insidehighered.com/rss/all', source: 'Inside Higher Ed' },
    { url: 'https://www.timeshighereducation.com/feed', source: 'Times Higher Education' },
    { url: 'https://www.chronicle.com/feed', source: 'Chronicle of Higher Ed' },
    { url: 'https://edsurge.com/rss', source: 'EdSurge' },
    { url: 'https://www.educationworld.com/rss/news.xml', source: 'Education World' },
    { url: 'https://www.wits.ac.za/news/rss/', source: 'Wits News' },
    { url: 'https://www.news.uct.ac.za/rss/', source: 'UCT News' },
    { url: 'https://www.sun.ac.za/english/news/rss', source: 'Stellenbosch News' },
    { url: 'https://www.up.ac.za/rss', source: 'UP News' },
    { url: 'https://www.uj.ac.za/news/rss/', source: 'UJ News' },
    // ═══ YOUTH JOBS FINANCE ═══
    { url: 'https://youthvillage.co.za/feed/', source: 'Youth Village' },
    { url: 'https://www.careers24.com/rss/', source: 'Careers24' },
    { url: 'https://www.pnet.co.za/rss/', source: 'PNet Jobs' },
    { url: 'https://www.fin24.com/rss/', source: 'Fin24' },
    { url: 'https://businesstech.co.za/news/feed/', source: 'BusinessTech' },
    { url: 'https://www.moneyweb.co.za/feed/', source: 'Moneyweb' },
    { url: 'https://learnerships.co.za/feed/', source: 'Learnerships SA' },
    { url: 'https://www.bizcommunity.com/rss/1/1.rss', source: 'BizCommunity' },
    { url: 'https://www.bizcommunity.com/rss/196/480.rss', source: 'BizCommunity HR' },
    { url: 'https://www.bizcommunity.com/rss/196/9.rss', source: 'BizCommunity Finance' },
    // ═══ TECH ═══
    { url: 'https://mybroadband.co.za/news/feed', source: 'MyBroadband' },
    { url: 'https://techcentral.co.za/feed', source: 'TechCentral' },
    { url: 'https://ventureburn.com/feed/', source: 'VentureBurn' },
    { url: 'https://disrupt-africa.com/feed/', source: 'Disrupt Africa' },
    { url: 'https://www.itweb.co.za/rss', source: 'ITWeb' },
    { url: 'https://thenextweb.com/feed/', source: 'The Next Web' },
    { url: 'https://techcrunch.com/feed/', source: 'TechCrunch' },
    { url: 'https://www.wired.com/feed/rss', source: 'Wired' },
    { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge' },
    { url: 'https://arstechnica.com/feed/', source: 'Ars Technica' },
    { url: 'https://feeds.feedburner.com/venturebeat/SZYF', source: 'VentureBeat' },
    { url: 'https://www.engadget.com/rss.xml', source: 'Engadget' },
    { url: 'https://www.zdnet.com/news/rss.xml', source: 'ZDNet' },
    // ═══ AFRICA ═══
    { url: 'https://allafrica.com/tools/headlines/rdf/southafrica/headlines.rdf', source: 'AllAfrica SA' },
    { url: 'https://allafrica.com/tools/headlines/rdf/education/headlines.rdf', source: 'AllAfrica Education' },
    { url: 'https://allafrica.com/tools/headlines/rdf/youth/headlines.rdf', source: 'AllAfrica Youth' },
    { url: 'https://www.theafricareport.com/feed/', source: 'The Africa Report' },
    { url: 'https://africacheck.org/feed/', source: 'Africa Check' },
    { url: 'https://www.africanews.com/feed/rss', source: 'AfricaNews' },
    { url: 'https://www.dailynewsegypt.com/feed/', source: 'Daily News Africa' },
    // ═══ SOCCER — PSL, EPL, UCL, BAFANA ═══
    { url: 'https://feeds.news24.com/articles/news24/Sport/rss', source: 'Sport News24' },
    { url: 'https://www.supersport.com/rss', source: 'SuperSport' },
    { url: 'https://www.goal.com/feeds/en/news', source: 'Goal.com' },
    { url: 'https://www.soccer-laduma.co.za/feed/', source: 'Soccer Laduma' },
    { url: 'https://www.kickoff.com/rss/news', source: 'KickOff SA' },
    { url: 'https://www.skysports.com/rss/12040', source: 'Sky Sports Football' },
    { url: 'https://www.skysports.com/rss/0,20514,11661,00.xml', source: 'Sky Sports PL' },
    { url: 'https://www.skysports.com/rss/0,20514,11667,00.xml', source: 'Sky Sports Champions League' },
    { url: 'https://www.skysports.com/rss/0,20514,11674,00.xml', source: 'Sky Sports La Liga' },
    { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml', source: 'BBC Sport Football' },
    { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport' },
    { url: 'https://www.espn.com/espn/rss/soccer/news', source: 'ESPN Soccer' },
    { url: 'https://www.espn.com/espn/rss/news', source: 'ESPN' },
    { url: 'https://www.fourfourtwo.com/rss', source: 'FourFourTwo' },
    { url: 'https://www.90min.com/rss', source: '90min' },
    { url: 'https://www.givemesport.com/rss', source: 'GiveMeSport' },
    { url: 'https://www.planet-sport.net/feed/', source: 'Planet Sport' },
    { url: 'https://www.transfermarkt.com/rss', source: 'Transfermarkt' },
    { url: 'https://www.footballtransfers.com/en/rss', source: 'Football Transfers' },
    { url: 'https://talksport.com/feed/', source: 'TalkSport' },
    { url: 'https://www.mirror.co.uk/sport/football/rss.xml', source: 'Mirror Football' },
    { url: 'https://www.theguardian.com/football/rss', source: 'Guardian Football' },
    { url: 'https://www.theguardian.com/football/premierleague/rss', source: 'Guardian PL' },
    { url: 'https://www.theguardian.com/football/champions-league/rss', source: 'Guardian UCL' },
    { url: 'https://www.theguardian.com/football/africanfootball/rss', source: 'Guardian African Football' },
    { url: 'https://www.sportingnews.com/rss', source: 'Sporting News' },
    { url: 'https://bleacherreport.com/articles/feed?tag_id=soccer', source: 'Bleacher Report Soccer' },
    // ═══ HEALTH WELLNESS ═══
    { url: 'https://health24.com/rss/', source: 'Health24' },
    { url: 'https://www.medicalnewstoday.com/rss/medicalnewstoday.xml', source: 'Medical News Today' },
    { url: 'https://www.healthline.com/rss/health-news', source: 'Healthline' },
    // ═══ SCIENCE RESEARCH ═══
    { url: 'https://www.scidev.net/sub-saharan-africa/rss/', source: 'SciDev Africa' },
    { url: 'https://phys.org/rss-feed/', source: 'Phys.org' },
    { url: 'https://www.sciencedaily.com/rss/top/science.xml', source: 'Science Daily' },
    { url: 'https://feeds.nature.com/nature/rss/current', source: 'Nature' },
    { url: 'https://www.newscientist.com/feed/home/', source: 'New Scientist' },
    { url: 'https://www.sciencenews.org/feed', source: 'Science News' },
    // ═══ ENTERTAINMENT LIFESTYLE ═══
    { url: 'https://www.channel24.co.za/rss/', source: 'Channel24' },
    { url: 'https://www.drum.co.za/rss/', source: 'Drum Magazine' },
    { url: 'https://www.truelove.co.za/rss/', source: 'True Love' },
    { url: 'https://www.gq.co.za/rss/', source: 'GQ SA' },
    { url: 'https://www.cosmopolitan.co.za/rss/', source: 'Cosmo SA' },
    { url: 'https://www.bbc.com/culture/feed.rss', source: 'BBC Culture' },
    { url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', source: 'BBC Entertainment' },
    { url: 'https://variety.com/feed/', source: 'Variety' },
    { url: 'https://www.rollingstone.com/music/music-news/feed/', source: 'Rolling Stone Music' },
    // ═══ GLOBAL NEWS ═══
    { url: 'https://feeds.bbci.co.uk/news/rss.xml', source: 'BBC News' },
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World' },
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business' },
    { url: 'https://rss.cnn.com/rss/edition.rss', source: 'CNN' },
    { url: 'https://rss.cnn.com/rss/edition_world.rss', source: 'CNN World' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://www.aljazeera.com/xml/rss/africa.xml', source: 'Al Jazeera Africa' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian World' },
    { url: 'https://www.theguardian.com/education/rss', source: 'The Guardian Education' },
    // ═══ GOVERNMENT POLICY ═══
    { url: 'https://www.gov.za/rss.xml', source: 'SA Government' },
    { url: 'https://www.parliament.gov.za/rss', source: 'Parliament SA' },
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
        .replace(/\s+/g,' ').trim().slice(0, 3000);
      const pubDate = get('pubDate') || get('published') || get('updated') || new Date().toISOString();
      const imgMatch = block.match(/url="([^"]*\.(jpg|jpeg|png|webp)[^"]*)"/i)
        || block.match(/<media:thumbnail[^>]*url="([^"]*)"/i)
        || block.match(/<enclosure[^>]*url="([^"]*\.(jpg|jpeg|png)[^"]*)"/i)
        || description.match(/<img[^>]*src="([^"]*)"/i);
      const image = imgMatch ? imgMatch[1] : null;
      const wordCount = clean.split(' ').length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      let category = 'general';
      const t = (title + ' ' + clean).toLowerCase();
      if (['soccer','football','goal','match','psl','premier league','bafana','fifa','uefa','champions league','transfer','striker','midfielder','defender','goalkeeper','hat-trick','penalty'].some(k=>t.includes(k))) category = 'soccer';
      else if (['student','university','nsfas','bursary','education','matric','exam','academic','campus','degree','scholarship','tvet','learnership'].some(k=>t.includes(k))) category = 'education';
      else if (['job','career','employ','intern','learnership','hiring','vacancy','recruitment'].some(k=>t.includes(k))) category = 'jobs';
      else if (['tech','ai','artificial intelligence','app','software','digital','cyber','startup','coding','programming'].some(k=>t.includes(k))) category = 'tech';
      else if (['health','mental','wellness','covid','medical','hospital','disease','fitness'].some(k=>t.includes(k))) category = 'health';
      else if (['science','research','discovery','space','climate','environment'].some(k=>t.includes(k))) category = 'science';
      else if (['music','movie','film','celebrity','entertainment','fashion','lifestyle'].some(k=>t.includes(k))) category = 'entertainment';
      if (title && link) {
        articles.push({ title, description: clean, url: link, image, publishedAt: pubDate, source, content: clean, readTime, category });
      }
    }
    return articles;
  }

  function injectAds(articles) {
    const ADS = [
      { title: "📚 Get Your Matric Past Papers — Free Download", description: "Download 10 years of NSC past papers for all subjects including Mathematics, Physical Sciences, Life Sciences, English, Accounting, Geography, History and Business Studies. Completely free on ScholrZA — no login required.", url: "https://scholrza.pages.dev", image: null, publishedAt: new Date().toISOString(), source: "ScholrZA", isAd: true, adLabel: "ScholrZA", readTime: 1, category: 'education' },
      { title: "🎓 Check Your APS Score Instantly — Free", description: "Use the free ScholrZA APS Calculator to see exactly which of the 26 SA public universities and programmes you qualify for. Takes 2 minutes. No signup needed. Updated for 2026.", url: "https://scholrza.pages.dev", image: null, publishedAt: new Date().toISOString(), source: "ScholrZA", isAd: true, adLabel: "ScholrZA", readTime: 1, category: 'education' },
      { title: "💳 NSFAS 2026 — Complete Application Guide", description: "Everything you need to apply for NSFAS: documents needed, step-by-step process, how to check your status, how to appeal a rejection and what NSFAS covers. All 26 SA universities covered.", url: "https://scholrza.pages.dev", image: null, publishedAt: new Date().toISOString(), source: "ScholrZA", isAd: true, adLabel: "ScholrZA", readTime: 1, category: 'education' },
      { title: "🏆 Open Bursaries for SA Students — Apply Now", description: "Hundreds of bursaries still open for SA students in 2026. Funza Lushaka, Eskom, Sasol, ABSA, Anglo American and more — with deadlines, amounts and direct apply links.", url: "https://scholrza.pages.dev", image: null, publishedAt: new Date().toISOString(), source: "ScholrZA", isAd: true, adLabel: "ScholrZA", readTime: 1, category: 'education' },
      { title: "🤖 ScholrBot — Free AI That Answers Anything", description: "Ask ScholrBot any question — Maths problems, essay help, NSFAS queries, bursary advice, APS calculations and more. Powered by AI. Completely free on ScholrZA.", url: "https://scholrza.pages.dev", image: null, publishedAt: new Date().toISOString(), source: "ScholrZA", isAd: true, adLabel: "ScholrZA", readTime: 1, category: 'general' },
      { title: "🏠 Student Accommodation Near Your University", description: "Find affordable student accommodation near all 26 SA universities. On-campus residences and private housing options. Updated for 2026. 100% free on ScholrZA.", url: "https://scholrza.pages.dev", image: null, publishedAt: new Date().toISOString(), source: "ScholrZA", isAd: true, adLabel: "ScholrZA", readTime: 1, category: 'general' },
    ];
    const result = [];
    let adIndex = 0;
    for (let i = 0; i < articles.length; i++) {
      result.push(articles[i]);
      if ((i + 1) % 8 === 0) { result.push(ADS[adIndex % ADS.length]); adIndex++; }
    }
    return result;
  }

  try {
    const results = await Promise.allSettled(
      FEEDS.map(f =>
        fetch(f.url, { headers: { 'User-Agent': 'ScholrZA/1.0 (scholrza.pages.dev)' }, signal: AbortSignal.timeout(7000) })
        .then(r => r.text()).then(xml => parseRSS(xml, f.source)).catch(() => [])
      )
    );

    let articles = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    const seen = new Set();
    articles = articles.filter(a => { const key = a.title.toLowerCase().slice(0,60); if(seen.has(key)) return false; seen.add(key); return true; });
    articles.sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const withAds = injectAds(articles.slice(0, 2000));
    return new Response(JSON.stringify({ articles: withAds, total: withAds.length }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ articles: [] }), { status: 200, headers: corsHeaders });
  }
}
