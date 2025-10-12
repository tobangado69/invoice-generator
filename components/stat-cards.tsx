import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatCards({
  stats,
}: {
  stats: { label: string; value: string; hint?: string }[]
}) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{s.value}</div>
            {s.hint ? <p className="text-xs text-muted-foreground mt-1">{s.hint}</p> : null}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
