import TaskCard from "@/app/components/task/TaskCard"
import NewTaskModal from "@/app/components/task/NewTaskModal"

type Task = {
  id: string
  title: string
  description: string | null
  position: number
  boardId: string
  columnId: string
}

type Column = {
  id: string
  title: string
  position: number
  tasks: Task[]
}

const EMPTY_MESSAGES: Record<string, string> = {
  "To Do": "No tasks to do yet",
  "In Progress": "Nothing in progress",
  "Done": "All caught up",
}

export default function KanbanColumn({
  column,
  boardId,
}: {
  column: Column
  boardId: string
}) {
  return (
    <div className="flex flex-col rounded-lg border border-edge bg-elevated">
      <div className="border-b border-edge px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {column.title}
        </h2>
      </div>
      <div className="flex min-h-48 flex-col gap-2 p-2">
        {column.tasks.length === 0 ? (
          <p className="m-auto text-xs text-muted">
            {EMPTY_MESSAGES[column.title] ?? "No tasks yet"}
          </p>
        ) : (
          column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
      <div className="border-t border-edge p-2">
        <NewTaskModal columnId={column.id} boardId={boardId} />
      </div>
    </div>
  )
}
