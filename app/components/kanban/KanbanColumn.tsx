type Column = {
  id: string
  title: string
  position: number
}

export default function KanbanColumn({ column }: { column: Column }) {
  return (
    <div className="flex flex-col rounded-lg border border-edge bg-elevated">
      <div className="border-b border-edge px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {column.title}
        </h2>
      </div>
      <div className="flex min-h-48 flex-col gap-2 p-2">
        {/* task cards rendered here in #5 */}
      </div>
    </div>
  )
}
