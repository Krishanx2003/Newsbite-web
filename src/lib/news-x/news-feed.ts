export type FeedCategory = "Politics" | "Entertainment" | "Sports" | "Economy" | "India" | "Tech" | "World" | "General"

export type FeedConfig = {
	url: string
	label: string
	category: FeedCategory
}

export const DEFAULT_FEEDS: FeedConfig[] = [
	{ url: "https://indianexpress.com/section/politics/feed/", label: "Indian Express - Politics", category: "Politics" },
	{ url: "https://www.thehindu.com/news/national/rss/", label: "The Hindu - National", category: "Politics" },
	{ url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", label: "Hindustan Times - India News", category: "Politics" },
	{ url: "https://www.ndtv.com/rss/india-news", label: "NDTV - India News", category: "Politics" },
	{ url: "https://www.indiatoday.in/rss/1206594", label: "India Today - Politics", category: "Politics" },
	{ url: "https://timesofindia.indiatimes.com/rssfeeds/1221656.cms", label: "Times of India - Politics", category: "Politics" },

	{ url: "https://indianexpress.com/section/entertainment/feed/", label: "Indian Express - Entertainment", category: "Entertainment" },
	{ url: "https://www.thehindu.com/entertainment/rss/", label: "The Hindu - Entertainment", category: "Entertainment" },
	{ url: "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml", label: "Hindustan Times - Entertainment", category: "Entertainment" },
	{ url: "https://www.ndtv.com/rss/entertainment", label: "NDTV - Entertainment", category: "Entertainment" },
	{ url: "https://www.indiatoday.in/rss/1206682", label: "India Today - Movies", category: "Entertainment" },
	{ url: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms", label: "TOI - Bollywood", category: "Entertainment" },
	{ url: "https://www.filmibeat.com/rss/filmibeat-fb.xml", label: "Filmibeat - Bollywood", category: "Entertainment" },
	{ url: "https://www.pinkvilla.com/feeds/all", label: "Pinkvilla - Bollywood", category: "Entertainment" },

	{ url: "https://indianexpress.com/section/sports/feed/", label: "Indian Express - Sports", category: "Sports" },
	{ url: "https://www.thehindu.com/sport/rss/", label: "The Hindu - Sports", category: "Sports" },
	{ url: "https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml", label: "Hindustan Times - Sports", category: "Sports" },
	{ url: "https://www.ndtv.com/rss/sports", label: "NDTV - Sports", category: "Sports" },
	{ url: "https://timesofindia.indiatimes.com/rssfeeds/4719145.cms", label: "TOI - Sports", category: "Sports" },

	{ url: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms", label: "TOI - Economy", category: "Economy" },
	{ url: "https://www.thehindu.com/business/rss/", label: "The Hindu - Business", category: "Economy" },
	{ url: "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml", label: "Hindustan Times - Business", category: "Economy" },
	{ url: "https://www.ndtv.com/rss/business", label: "NDTV - Business", category: "Economy" },
	{ url: "https://www.indiatoday.in/rss/1206692", label: "India Today - Business", category: "Economy" },
	{ url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", label: "Economic Times - Markets", category: "Economy" },
	{ url: "https://www.moneycontrol.com/rss/latestnews.xml", label: "Moneycontrol - Latest", category: "Economy" },

	{ url: "https://indianexpress.com/section/india/feed/", label: "Indian Express - India", category: "India" },
	{ url: "https://www.thehindu.com/news/cities/rss/", label: "The Hindu - Cities", category: "India" },
	{ url: "https://www.hindustantimes.com/feeds/rss/cities/delhi-news/rssfeed.xml", label: "Hindustan Times - Delhi", category: "India" },
	{ url: "https://www.ndtv.com/rss/india-crime", label: "NDTV - Crime", category: "India" },
	{ url: "https://timesofindia.indiatimes.com/rssfeeds/1221700.cms", label: "TOI - Cities", category: "India" },
	{ url: "https://www.firstpost.com/feed", label: "FirstPost", category: "India" },

	{ url: "https://www.gadgets360.com/rss/news", label: "NDTV Gadgets 360", category: "Tech" },
	{ url: "https://techcrunch.com/feed/", label: "TechCrunch", category: "Tech" },
	{ url: "https://www.wired.com/feed/rss", label: "Wired", category: "Tech" },
	{ url: "https://www.theverge.com/rss/index.xml", label: "The Verge", category: "Tech" },
	{ url: "https://www.engadget.com/rss.xml", label: "Engadget", category: "Tech" },

	{ url: "https://rss.cnn.com/rss/cnn_topstories.rss", label: "CNN - Top Stories", category: "World" },
	{ url: "https://www.theguardian.com/world/rss", label: "The Guardian - World", category: "World" },
	{ url: "https://www.bbc.com/news/rss.xml", label: "BBC - World", category: "World" },
	{ url: "https://feeds.reuters.com/reuters/topNews", label: "Reuters - Top News", category: "World" },
	{ url: "https://www.aljazeera.com/xml/rss/all.xml", label: "Al Jazeera - World", category: "World" },
	{ url: "https://apnews.com/hub/world-news", label: "AP - World", category: "World" },

	{ url: "https://www.huffpost.com/section/front-page/feed", label: "HuffPost", category: "General" },
	{ url: "https://www.buzzfeed.com/index.xml", label: "BuzzFeed", category: "General" },
	{ url: "https://news.ycombinator.com/rss", label: "Hacker News", category: "General" },
]

export const FEED_CATEGORIES: FeedCategory[] = [
	"Politics",
	"Entertainment",
	"Sports",
	"Economy",
	"India",
	"Tech",
	"World",
	"General",
]


