"use client"

export function Pagination({
	total,
	page,
	pageSize,
	onPageChange,
}: {
	total: number
	page: number
	pageSize: number
	onPageChange: (next: number) => void
}) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize))
	const canPrev = page > 1
	const canNext = page < totalPages

	if (totalPages <= 1) return null

	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
		Math.max(0, page - 3),
		Math.min(totalPages, page + 2),
	)

	return (
		<nav className="flex items-center gap-2" aria-label="Pagination">
			<button
				className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
				disabled={!canPrev}
				onClick={() => onPageChange(page - 1)}
			>
				Previous
			</button>
			{pageNumbers.map((n) => (
				<button
					key={n}
					className={`rounded-md border px-3 py-2 text-sm ${n === page ? "bg-primary text-primary-foreground" : ""}`}
					onClick={() => onPageChange(n)}
					aria-current={n === page ? "page" : undefined}
				>
					{n}
				</button>
			))}
			<button
				className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
				disabled={!canNext}
				onClick={() => onPageChange(page + 1)}
			>
				Next
			</button>
		</nav>
	)
}


