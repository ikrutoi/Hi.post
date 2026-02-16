export type CardEditorState = {
  id: string
  cardphoto: { isComplete: boolean }
  cardtext: { isComplete: boolean }
  envelope: { isComplete: boolean }
  aroma: { isComplete: boolean }
  date: { isComplete: boolean }
  isCompleted: boolean
  isRainbowActive: boolean
  isRainbowStopping: boolean
}
