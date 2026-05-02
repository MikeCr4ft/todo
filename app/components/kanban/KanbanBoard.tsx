import { getColumnsByBoard } from "@/lib/repositories/column"
import KanbanColumn from "@/app/components/kanban/KanbanColumn"

export default async function KanbanBoard({ boardId }: { boardId: string }) {
  const columns = await getColumnsByBoard(boardId)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn key={column.id} column={column} />
      ))}
    </div>
  )
}
