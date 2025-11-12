"use client"

export type Article = {
	title: string
	description: string
	url: string
	urlToImage: string | null
	source: { name: string }
	publishedAt?: string
	category?: string
}

function toSafeText(value: unknown): string {
	if (typeof value === "string") return value
	if (value && typeof value === "object") {
		const v = value as Record<string, unknown>
		if (typeof v._ === "string") return v._
	}
	return ""
}

export function ArticleCard({
	article,
	checked,
	onToggle,
}: {
	article: Article
	checked: boolean
	onToggle: () => void
}) {
	const title = toSafeText((article as any).title) || ""
	const description = toSafeText((article as any).description) || ""
	const sourceName = toSafeText((article as any).source?.name) || ""
	const category = toSafeText((article as any).category) || ""
	const publishedAt = toSafeText((article as any).publishedAt) || ""
	const urlToImage = typeof (article as any).urlToImage === "string" ? (article as any).urlToImage : null
	const url = typeof (article as any).url === "string" ? (article as any).url : "#"

	return (
		<article className="relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
			<div className="absolute top-3 right-3">
				<label className="inline-flex items-center gap-2 cursor-pointer">
					<input
						aria-label="Select article"
						type="checkbox"
						checked={checked}
						onChange={onToggle}
						className="size-5 accent-[var(--color-primary)]"
					/>
				</label>
			</div>

			{urlToImage ? (
				<img src={urlToImage || "/placeholder.svg"} alt={title} className="w-full h-40 object-cover" />
			) : (
				<div className="w-full h-40 bg-muted" aria-hidden="true" />
			)}

			<div className="p-4 flex flex-col gap-2">
				<h3 className="text-base font-semibold text-balance">{title}</h3>
				<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
					{sourceName && <span className="px-2 py-0.5 rounded bg-secondary">{sourceName}</span>}
					{category && <span className="px-2 py-0.5 rounded bg-accent">{category}</span>}
					{publishedAt && <time dateTime={publishedAt}>{new Date(publishedAt).toLocaleString()}</time>}
				</div>
				{description && <p className="text-sm text-pretty leading-relaxed line-clamp-3">{description}</p>}
				<div className="pt-2">
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm underline underline-offset-4 hover:no-underline"
					>
						Read original
					</a>
				</div>
			</div>
		</article>
	)
}


