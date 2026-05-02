import { getColumnsWithTasks } from "@/lib/repositories/column"
import KanbanBoardClient from "@/app/components/kanban/KanbanBoardClient"

export default async function KanbanBoard({ boardId }: { boardId: string }) {
  const columns = await getColumnsWithTasks(boardId)
  return <KanbanBoardClient columns={columns} boardId={boardId} />
}
