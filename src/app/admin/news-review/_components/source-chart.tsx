"use client"
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts"

type SourceDatum = { name: string; value: number }

const COLORS = [
	"oklch(0.646 0.222 41.116)",
	"oklch(0.6 0.118 184.704)",
	"oklch(0.398 0.07 227.392)",
	"oklch(0.828 0.189 84.429)",
	"oklch(0.769 0.188 70.08)",
]

export function SourceChart({ data }: { data: SourceDatum[] }) {
	const total = data.reduce((s, d) => s + d.value, 0)
	if (!total) {
		return (
			<div className="rounded-lg border bg-card p-4">
				<p className="text-sm text-muted-foreground">No data to visualize</p>
			</div>
		)
	}
	return (
		<div className="rounded-lg border bg-card p-4">
			<h4 className="text-sm font-semibold mb-3">Sources</h4>
			<div className="h-56">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={50}
							outerRadius={80}
							paddingAngle={2}
						>
							{data.map((_, idx) => (
								<Cell key={idx} fill={COLORS[idx % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								background: "var(--color-popover)",
								color: "var(--color-popover-foreground)",
								border: "1px solid var(--color-border)",
								borderRadius: "8px",
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}


