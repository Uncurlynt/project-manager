import { defineStore } from 'pinia'
import axios from 'axios'
import type { Issue, CreateIssuePayload } from '@/types'

export const useIssuesStore = defineStore('issues', {
    state: () => ({
        issues: [] as Issue[],
        currentBoardIssues: [] as Issue[]
    }),
    actions: {
        async fetchAllIssues() {
            try {
                const res = await axios.get('/api/v1/tasks')
                // мапим и достаём assignee.id в assigneeId
                this.issues = (res.data.data as any[]).map(t => ({
                    id:          t.id,
                    title:       t.title,
                    description: t.description,
                    status:      t.status,
                    priority:    t.priority,
                    boardId:     t.boardId,
                    assigneeId:  t.assignee?.id ?? null,
                }))
            } catch (err) {
                console.error('Failed to fetch issues', err)
            }
        },

        async fetchBoardIssues(boardId: number) {
            try {
                const res = await axios.get(`/api/v1/boards/${boardId}`)
                // в ответе нет boardId, подставляем его из аргумента
                this.currentBoardIssues = (res.data.data as any[]).map(t => ({
                    id:          t.id,
                    title:       t.title,
                    description: t.description,
                    status:      t.status,
                    priority:    t.priority,
                    boardId,
                    assigneeId:  t.assignee?.id ?? null,
                }))
            } catch (err) {
                console.error('Failed to fetch board issues', err)
            }
        },
    async createIssue(payload: CreateIssuePayload) {
      try {
        const res = await axios.post('/api/v1/tasks/create', payload)
        const created = res.data.data
        if (created) {
          this.issues.push(created)
          if (this.currentBoardIssues[0]?.boardId === created.boardId) {
            this.currentBoardIssues.push(created)
          }
        }
      } catch (err) {
        console.error('Failed to create issue', err)
      }
    },
    async updateIssue(id: number, changes: Partial<Issue>) {
      try {
        await axios.put(`/api/v1/tasks/update/${id}`, changes)
        const updateArray = (arr: Issue[]) =>
          arr.map(i => i.id === id ? { ...i, ...changes } as Issue : i)
        this.issues = updateArray(this.issues)
        this.currentBoardIssues = updateArray(this.currentBoardIssues)
      } catch (err) {
        console.error('Failed to update issue', err)
      }
    },
    async updateIssueStatus(id: number, status: string) {
      try {
        await axios.put(`/api/v1/tasks/updateStatus/${id}`, { status })
        const updateArray = (arr: Issue[]) =>
          arr.map(i => i.id === id ? { ...i, status } as Issue : i)
        this.issues = updateArray(this.issues)
        this.currentBoardIssues = updateArray(this.currentBoardIssues)
      } catch (err) {
        console.error('Failed to update issue status', err)
      }
    }
  }
})
