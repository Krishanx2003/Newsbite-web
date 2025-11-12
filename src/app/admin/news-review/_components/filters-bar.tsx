"use client"

import { FEED_CATEGORIES } from "@/lib/news-x/news-feed"
import { FeedManager, useCustomApis } from "./feed-manager"

export type Filters = {
	q: string
	category: string
	source: string
	sort: "newest" | "oldest" | "title-asc" | "title-desc"
	pageSize: number
	includeDefault: boolean
	customApi: string
}

export function FiltersBar({
	availableSources,
	value,
	onChange,
}: {
	availableSources: string[]
	value: Filters
	onChange: (next: Filters) => void
}) {
	const { apis, selected, setSelected, addApi, removeApi } = useCustomApis()

	const update = (patch: Partial<Filters>) => onChange({ ...value, ...patch })

	return (
		<section className="grid grid-cols-1 gap-3 rounded-lg border bg-card p-4 md:grid-cols-3">
			<div className="col-span-1 md:col-span-3 flex items-center gap-2">
				<input
					value={value.q}
					onChange={(e) => update({ q: e.target.value })}
					placeholder="Search title, description, source"
					className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
					aria-label="Search articles"
				/>
				<button className="rounded-md border px-3 py-2 text-sm" onClick={() => update({ q: "" })}>
					Clear
				</button>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-muted-foreground">Category</label>
				<select
					value={value.category}
					onChange={(e) => update({ category: e.target.value })}
					className="rounded-md border bg-background px-2 py-2 text-sm"
					aria-label="Filter by category"
				>
					<option value="">All</option>
					{FEED_CATEGORIES.map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-muted-foreground">Source</label>
				<select
					value={value.source}
					onChange={(e) => update({ source: e.target.value })}
					className="rounded-md border bg-background px-2 py-2 text-sm"
					aria-label="Filter by source"
				>
					<option value="">All</option>
					{availableSources.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-muted-foreground">Sort</label>
				<select
					value={value.sort}
					onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
					className="rounded-md border bg-background px-2 py-2 text-sm"
					aria-label="Sort articles"
				>
					<option value="newest">Newest</option>
					<option value="oldest">Oldest</option>
					<option value="title-asc">Title A–Z</option>
					<option value="title-desc">Title Z–A</option>
				</select>
			</div>

			<div className="flex flex-col gap-1">
				<label className="text-xs text-muted-foreground">Page size</label>
				<select
					value={String(value.pageSize)}
					onChange={(e) => update({ pageSize: Number(e.target.value) })}
					className="rounded-md border bg-background px-2 py-2 text-sm"
					aria-label="Page size"
				>
					{[12, 24, 36, 48].map((n) => (
						<option key={n} value={n}>
							{n} per page
						</option>
					))}
				</select>
			</div>

			<div className="flex items-center gap-2">
				<input
					id="include-default"
					type="checkbox"
					checked={value.includeDefault}
					onChange={(e) => update({ includeDefault: e.target.checked })}
					className="size-4 accent-[var(--color-primary)]"
				/>
				<label htmlFor="include-default" className="text-sm">
					Include default feeds
				</label>
			</div>

			<div className="md:col-span-3">
				<FeedManager
					selected={selected}
					apis={apis}
					onSelect={(u) => {
						setSelected(u)
						update({ customApi: u })
					}}
					onAdd={(u) => {
						addApi(u)
						update({ customApi: u })
					}}
					onRemove={(u) => {
						removeApi(u)
						if (u === selected) update({ customApi: "" })
					}}
				/>
			</div>
		</section>
	)
}


