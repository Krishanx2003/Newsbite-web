import { DEFAULT_FEEDS, FeedConfig } from "@/lib/news-x/news-feed"
import { type NextRequest, NextResponse } from "next/server"
import * as xml2js from "xml2js"

type Article = {
	title: string
	description: string
	url: string
	urlToImage: string | null
	source: { name: string }
	publishedAt?: string
	category?: string
}

function normalizeUrl(u: any): string {
	if (!u) return ""
	if (typeof u === "string") return u
	if (typeof u === "object") return u.href || u._ || ""
	return ""
}

function toISOStringSafe(input?: string): string | undefined {
	if (!input) return undefined
	const d = new Date(input)
	return isNaN(d.getTime()) ? undefined : d.toISOString()
}

async function fetchRssFeed(feed: FeedConfig, parser: xml2js.Parser): Promise<Article[]> {
	const res = await fetch(feed.url)
	const xml = await res.text()
	// @ts-ignore xml2js types
	const parsed = await parser.parseStringPromise(xml)

	let items: any[] = []
	if (parsed?.rss?.channel?.item) {
		items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item]
	} else if (parsed?.feed?.entry) {
		items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry]
	}

	return items.map((item: any) => {
		const title = item?.title?._ || item?.title || "No Title"
		const description = item?.description || item?.summary || ""
		const link = normalizeUrl(item?.link)
		const sourceName =
			item?.source?._ || parsed?.rss?.channel?.title || parsed?.feed?.title?._ || parsed?.feed?.title || "Unknown"
		const publishedAt = item?.pubDate || item?.published || item?.updated || item?.updated_at || undefined

		return {
			title,
			description,
			url: link,
			urlToImage: null,
			source: { name: String(sourceName) },
			publishedAt: toISOStringSafe(publishedAt),
			category: feed.category,
		}
	})
}

function coerceIncomingArticles(payload: any): Article[] {
	const list = Array.isArray(payload)
		? payload
		: Array.isArray(payload?.articles)
			? payload.articles
			: Array.isArray(payload?.items)
				? payload.items
				: []

	return list
		.map((a: any) => {
			const title = a?.title || "No Title"
			const description = a?.description || a?.summary || ""
			const url = a?.url || normalizeUrl(a?.link)
			const urlToImage = a?.urlToImage ?? a?.image ?? null
			const sourceName =
				a?.source?.name || a?.source || a?.site || (a?.domain ? String(a.domain) : undefined) || "Custom API"
			const publishedAt = a?.publishedAt || a?.pubDate || a?.date || a?.created_at

			return {
				title: String(title),
				description: String(description),
				url: String(url || ""),
				urlToImage: urlToImage ? String(urlToImage) : null,
				source: { name: String(sourceName) },
				publishedAt: toISOStringSafe(publishedAt),
				category: a?.category,
			} as Article
		})
		.filter((a: Article) => a.url)
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)

		const page = Math.max(1, Number(searchParams.get("page") || 1))
		const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || 24)))
		const q = (searchParams.get("q") || "").trim().toLowerCase()
		const category = searchParams.get("category") || ""
		const sourceFilter = searchParams.get("source") || ""
		const sort = (searchParams.get("sort") || "newest") as "newest" | "oldest" | "title-asc" | "title-desc"
		const includeDefault = (searchParams.get("includeDefault") || "true") === "true"
		const customApi = searchParams.get("customApi") || ""

		const parser = new xml2js.Parser({ explicitArray: false })

		let articles: Article[] = []
		if (includeDefault) {
			const results = await Promise.allSettled(DEFAULT_FEEDS.map((feed) => fetchRssFeed(feed, parser)))
			for (const r of results) {
				if (r.status === "fulfilled") articles.push(...r.value)
			}
		}

		if (customApi) {
			try {
				const r = await fetch(customApi)
				const data = await r.json()
				const coerced = coerceIncomingArticles(data)
				articles.push(...coerced)
			} catch (err) {
				console.error("[news] Failed customApi fetch:", err)
			}
		}

		if (q) {
			articles = articles.filter(
				(a) =>
					a.title.toLowerCase().includes(q) ||
					(a.description || "").toLowerCase().includes(q) ||
					(a.source?.name || "").toLowerCase().includes(q),
			)
		}
		if (category) {
			articles = articles.filter((a) => (a.category || "General") === category)
		}
		if (sourceFilter) {
			articles = articles.filter((a) => (a.source?.name || "") === sourceFilter)
		}

		const getTime = (a: Article) => (a.publishedAt ? new Date(a.publishedAt).getTime() : 0)
		switch (sort) {
			case "newest":
				articles.sort((a, b) => getTime(b) - getTime(a))
				break
			case "oldest":
				articles.sort((a, b) => getTime(a) - getTime(b))
				break
			case "title-asc":
				articles.sort((a, b) => a.title.localeCompare(b.title))
				break
			case "title-desc":
				articles.sort((a, b) => b.title.localeCompare(a.title))
				break
		}

		const sourceCountsMap = new Map<string, number>()
		for (const a of articles) {
			const name = a.source?.name || "Unknown"
			sourceCountsMap.set(name, (sourceCountsMap.get(name) || 0) + 1)
		}
		const sourceCounts = Array.from(sourceCountsMap.entries()).map(([name, value]) => ({
			name,
			value,
		}))
		const availableSources = Array.from(sourceCountsMap.keys()).sort((a, b) => a.localeCompare(b))

		const total = articles.length
		const start = (page - 1) * pageSize
		const end = start + pageSize
		const paginated = articles.slice(start, end)

		return NextResponse.json({
			articles: paginated,
			total,
			page,
			pageSize,
			availableSources,
			sourceCounts,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
	}
}


