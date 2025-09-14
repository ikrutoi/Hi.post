export type buttonState = 'default' | 'hover' | 'active'

export type buttonMap = {
  [section: string]: {
    [tooltip: string]: buttonState
  }
}
