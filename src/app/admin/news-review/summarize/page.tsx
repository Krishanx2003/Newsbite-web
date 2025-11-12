"use client"

import { useEffect, useState } from "react"

interface Article {
    title: string
    description: string
    url: string
    urlToImage: string | null
    source?: { name?: string }
}

interface Summary {
    title: string
    source: string
    summary: string
    approved?: boolean
}

export default function SummarizePage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [summaries, setSummaries] = useState<Summary[]>([])
    const [loading, setLoading] = useState(false)
    const [engine, setEngine] = useState<"openai" | "huggingface">("openai")

    useEffect(() => {
        try {
            const stored = localStorage.getItem("selectedArticles")
            if (stored) setArticles(JSON.parse(stored))
        } catch { }
    }, [])

    const summarize = async () => {
        if (articles.length === 0) return
        setLoading(true)
        try {
            const res = await fetch(engine === "openai" ? "/api/admin/news-review/summarize" : "/api/admin/news-review/hf-summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articles }),
            })
            const data = await res.json()

            if (engine === "openai") {
                const text: string = data.summaries || ""
                const parsed = text
                    .split(/\n+/)
                    .filter((line: string) => /^\d+\.\s*/.test(line.trim()))
                    .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
                    .map((s: string, i: number) => ({
                        title: articles[i]?.title || `Article ${i + 1}`,
                        source: articles[i]?.source?.name || "Unknown",
                        summary: s,
                    }))
                setSummaries(parsed)
            } else {
                const arr: string[] = Array.isArray(data.summaries) ? data.summaries : []
                const parsed = arr.map((s: string, i: number) => ({
                    title: articles[i]?.title || `Article ${i + 1}`,
                    source: articles[i]?.source?.name || "Unknown",
                    summary: s,
                }))
                setSummaries(parsed)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const approveSummary = async (s: Summary, article?: Article) => {
        try {
            const res = await fetch("/api/admin/news-review/post-to-x", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ summary: s.summary, url: article?.url }),
            })
            const data = await res.json()
            if (data?.url) window.open(data.url, "_blank")
        } catch (e) {
            const url = `https://x.com/intent/tweet?text=${encodeURIComponent(`📰 ${s.summary} #NewsBite`)}`
            window.open(url, "_blank")
        }

        setSummaries((prev) => prev.map((x) => (x.title === s.title ? { ...x, approved: true } : x)))
    }

    const rejectSummary = (s: Summary) => {
        setSummaries((prev) => prev.filter((x) => x.title !== s.title))
    }

    return (
        <main className="mx-auto max-w-4xl p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Review & Approve Summaries</h1>
                <p className="text-sm text-muted-foreground">Generate tweet-length summaries and send approved ones to X.</p>
            </header>

            {summaries.length === 0 && (
                <section className="mb-6 flex gap-6 rounded-lg border bg-card p-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="radio" checked={engine === "openai"} onChange={() => setEngine("openai")} />
                        OpenAI (AI SDK)
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="radio" checked={engine === "huggingface"} onChange={() => setEngine("huggingface")} />
                        Hugging Face style
                    </label>
                </section>
            )}

            {summaries.length === 0 && (
                <section className="space-y-4">
                    {articles.map((a, i) => (
                        <article key={i} className="rounded border bg-card p-4 shadow-sm">
                            <h2 className="text-lg font-semibold text-balance">{a.title}</h2>
                            <p className="text-xs text-muted-foreground">{a.source?.name}</p>
                            {a.description && <p className="mt-2 text-sm leading-relaxed">{a.description}</p>}
                        </article>
                    ))}
                </section>
            )}

            {articles.length > 0 && summaries.length === 0 && (
                <div className="mt-6">
                    <button
                        onClick={summarize}
                        disabled={loading}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                    >
                        {loading ? `Summarizing with ${engine}…` : `Generate Summaries with ${engine}`}
                    </button>
                </div>
            )}

            {summaries.length > 0 && (
                <section className="mt-6 space-y-4">
                    {summaries.map((s, i) => (
                        <article key={i} className={`rounded border p-4 shadow-sm ${s.approved ? "bg-green-50" : "bg-card"}`}>
                            <h3 className="text-lg font-semibold">{s.title}</h3>
                            <p className="text-xs text-muted-foreground">{s.source}</p>
                            <p className="mt-2">{s.summary}</p>

                            {!s.approved && (
                                <div className="mt-3 flex gap-3">
                                    <button
                                        onClick={() => approveSummary(s, articles[i])}
                                        className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground"
                                    >
                                        Approve
                                    </button>
                                    <button onClick={() => rejectSummary(s)} className="rounded-md border px-3 py-1 text-sm">
                                        Reject
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </section>
            )}
        </main>
    )
}


