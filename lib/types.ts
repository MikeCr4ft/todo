export type Task = {
  id: string
  title: string
  description: string | null
  position: number
  boardId: string
  columnId: string
}

export type Column = {
  id: string
  title: string
  position: number
  tasks: Task[]
}

export type Board = {
  id: string
  title: string
}
