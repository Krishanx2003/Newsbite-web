import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
	try {
		const { articles } = await req.json();

		const prompt = `
  You are a social media assistant. Summarize each of the following news articles into a short, catchy tweet.
Rules:
- Max 100 characters per tweet.
- Add 1–2 relevant hashtags.
- Output as a numbered list, one line per article. Do not add extra commentary.
    Articles:
    ${articles.map((a: any, i: number) => `${i + 1}. ${a.title}\n${a.description || ""}`).join("\n\n")}
    `;

		const completion = await client.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.5,
		});

		return NextResponse.json({
			summaries: completion.choices[0].message?.content,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
	}
}


