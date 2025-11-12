"use client"

import * as React from "react"
import useSWR from "swr"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { Filters, FiltersBar } from "./_components/filters-bar"
import { Article, ArticleCard } from "./_components/article-card"
import { Pagination } from "./_components/pagination"
import { SourceChart } from "./_components/source-chart"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function NewsPageContent() {
    const router = useRouter()
    const params = useSearchParams()

    const [filters, setFilters] = React.useState<Filters>({
        q: params.get("q") || "",
        category: params.get("category") || "",
        source: params.get("source") || "",
        sort: (params.get("sort") as Filters["sort"]) || "newest",
        pageSize: Number(params.get("pageSize")) || 24,
        includeDefault: (params.get("includeDefault") || "true") === "true",
        customApi: params.get("customApi") || "",
    })
    const [page, setPage] = React.useState<number>(Number(params.get("page")) || 1)

    React.useEffect(() => {
        const sp = new URLSearchParams()
        if (filters.q) sp.set("q", filters.q)
        if (filters.category) sp.set("category", filters.category)
        if (filters.source) sp.set("source", filters.source)
        if (filters.sort) sp.set("sort", filters.sort)
        if (filters.pageSize) sp.set("pageSize", String(filters.pageSize))
        if (!filters.includeDefault) sp.set("includeDefault", "false")
        if (filters.customApi) sp.set("customApi", filters.customApi)
        if (page !== 1) sp.set("page", String(page))
        const qs = sp.toString()
        window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
    }, [filters, page])

    const key = React.useMemo(() => {
        const sp = new URLSearchParams()
        sp.set("page", String(page))
        sp.set("pageSize", String(filters.pageSize))
        if (filters.q) sp.set("q", filters.q)
        if (filters.category) sp.set("category", filters.category)
        if (filters.source) sp.set("source", filters.source)
        if (filters.sort) sp.set("sort", filters.sort)
        sp.set("includeDefault", String(filters.includeDefault))
        if (filters.customApi) sp.set("customApi", filters.customApi)
        return `/api/admin/news-review/news?${sp.toString()}`
    }, [filters, page])

    const { data, isLoading, error } = useSWR<{
        articles: Article[]
        total: number
        page: number
        pageSize: number
        availableSources: string[]
        sourceCounts: { name: string; value: number }[]
    }>(key, fetcher)

    const [selected, setSelected] = React.useState<Article[]>([])

    const toggleSelect = (article: Article) => {
        setSelected((curr) => {
            const exists = curr.find((a) => a.url === article.url)
            if (exists) return curr.filter((a) => a.url !== article.url)
            if (curr.length >= 5) {
                alert("You can only select up to 5 articles.")
                return curr
            }
            return [...curr, article]
        })
    }

    const goToSummarize = () => {
        if (selected.length === 0) return
        localStorage.setItem("selectedArticles", JSON.stringify(selected))
        router.push("/admin/news-review/summarize")
    }

    const total = data?.total ?? 0
    const articles = data?.articles ?? []
    const availableSources = data?.availableSources ?? []
    const sourceCounts = data?.sourceCounts ?? []

    return (
        <main className="mx-auto max-w-6xl p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">News Review Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Filter, sort, and explore articles from multiple sources. Select up to 5 to summarize.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <FiltersBar
                        availableSources={availableSources}
                        value={filters}
                        onChange={(f) => {
                            setFilters(f)
                            setPage(1)
                        }}
                    />
                </div>
                <div>
                    <SourceChart data={sourceCounts} />
                </div>
            </div>

            <section className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {isLoading ? "Loading…" : error ? "Failed to load" : `${total} articles`}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={goToSummarize}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                        disabled={selected.length === 0}
                    >
                        Continue to Summarize ({selected.length}/5)
                    </button>
                </div>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: Article, index: number) => (
                    <ArticleCard
                        key={`${article.url}-${index}`}
                        article={article}
                        checked={!!selected.find((a) => a.url === article.url)}
                        onToggle={() => toggleSelect(article)}
                    />
                ))}
            </section>

            <div className="mt-6 flex items-center justify-center">
                <Pagination total={total} page={page} pageSize={filters.pageSize} onPageChange={setPage} />
            </div>
        </main>
    )
}

export default function NewsPage() {
    return (
        <Suspense fallback={<div>Loading page…</div>}>
            <NewsPageContent />
        </Suspense>
    )
}


