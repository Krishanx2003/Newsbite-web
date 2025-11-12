import { NextResponse } from "next/server"

export async function POST(req: Request) {
	try {
		const { summary, url } = (await req.json()) as { summary: string; url?: string }

		let tweetText = `📰 ${summary} #NewsBite`
		if (tweetText.length > 279) {
			tweetText = tweetText.slice(0, 276) + "…"
		}
		if (url) {
			const maybe = `\n${url}`
			if (tweetText.length + maybe.length <= 280) {
				tweetText += maybe
			}
		}

		const encoded = encodeURIComponent(tweetText)
	 return NextResponse.json({ url: `https://x.com/intent/tweet?text=${encoded}` })
	} catch (error) {
		console.error("[/api/admin/news-review/post-to-x] error:", error)
		return NextResponse.json({ error: "Failed to prepare tweet" }, { status: 500 })
	}
}


