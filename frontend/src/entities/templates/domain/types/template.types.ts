export interface TemplateBase {
  id: string
  localId: number
  serverId?: string | null
  syncedAt?: number | null
  isDirty?: boolean
  createdAt: number
  updatedAt: number
}

export interface TemplateMetadata {
  name?: string
  preview?: string
}

export type TemplateSection = 'cardphoto' | 'cardtext' | 'recipient' | 'sender'

export interface TemplateOperationResult {
  success: boolean
  error?: string
  templateId?: number | string
}
