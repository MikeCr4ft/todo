import { getColumnsWithTasks } from "@/lib/repositories/column"
import KanbanColumn from "@/app/components/kanban/KanbanColumn"

export default async function KanbanBoard({ boardId }: { boardId: string }) {
  const columns = await getColumnsWithTasks(boardId)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn key={column.id} boardId={boardId} column={column} />
      ))}
    </div>
  )
}
