"use client"

import * as React from "react"

const STORAGE_KEY = "custom-news-apis"

export type CustomApiState = {
	apis: string[]
	selected: string
}

export function useCustomApis() {
	const [apis, setApis] = React.useState<string[]>([])
	const [selected, setSelected] = React.useState<string>("")

	React.useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (raw) {
				const parsed = JSON.parse(raw)
				if (Array.isArray(parsed)) {
					setApis(parsed)
					setSelected(parsed[0] || "")
				}
			}
		} catch (e) {
		}
	}, [])

	const persist = (next: string[]) => {
		setApis(next)
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
		} catch {}
	}

	const addApi = (url: string) => {
		const trimmed = url.trim()
		if (!trimmed) return
		try {
			const u = new URL(trimmed)
			if (!["http:", "https:"].includes(u.protocol)) return
		} catch {
			return
		}
		if (!apis.includes(trimmed)) {
			const next = [trimmed, ...apis]
			persist(next)
			setSelected(trimmed)
		}
	}

	const removeApi = (url: string) => {
		const next = apis.filter((a) => a !== url)
		persist(next)
		if (selected === url) setSelected(next[0] || "")
	}

	return { apis, selected, setSelected, addApi, removeApi }
}

export function FeedManager({
	selected,
	apis,
	onSelect,
	onAdd,
	onRemove,
}: {
	selected: string
	apis: string[]
	onSelect: (url: string) => void
	onAdd: (url: string) => void
	onRemove: (url: string) => void
}) {
	const [input, setInput] = React.useState("")

	return (
		<div className="flex flex-col gap-2 rounded-lg border bg-card p-3">
			<h4 className="text-sm font-semibold">Custom API</h4>
			<div className="flex items-center gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="https://example.com/api/news"
					className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
					aria-label="Custom API URL"
				/>
				<button
					className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm"
					onClick={() => {
						onAdd(input)
						setInput("")
					}}
				>
					Add
				</button>
			</div>

			<div className="flex items-center gap-2">
				<label className="text-sm">Select:</label>
				<select
					className="flex-1 rounded-md border bg-background px-2 py-2 text-sm"
					value={selected}
					onChange={(e) => onSelect(e.target.value)}
					aria-label="Select saved API"
				>
					<option value="">None</option>
					{apis.map((u) => (
						<option key={u} value={u}>
							{u}
						</option>
					))}
				</select>
				{selected && (
					<button className="rounded-md border px-3 py-2 text-sm" onClick={() => onRemove(selected)}>
						Remove
					</button>
				)}
			</div>
			<p className="text-xs text-muted-foreground">
				We’ll fetch from your selected API on top of default feeds (toggle below).
			</p>
		</div>
	)
}


