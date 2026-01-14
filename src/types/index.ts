export interface Board {
  id: number
  name: string
  description: string
  taskCount?: number
}

export type IssueStatus = 'Backlog' | 'InProgress' | 'Done'

export interface Issue {
  id: number
  title: string
  description: string
  status: IssueStatus
  boardId: number
  priority: 'Low' | 'Medium' | 'High'
  assigneeId?: number
}

export interface CreateIssuePayload {
  title: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  assigneeId?: number
  boardId: number
  status?: IssueStatus
}