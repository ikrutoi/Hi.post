export type SizeCard = { width: number | null; height: number | null }
export type ImageSet = {
  originalImage: boolean
  workingImage: boolean
  miniImage: boolean
}
export type ActiveSections = {
  cardphoto: boolean
  cardtext: boolean
  envelope: boolean
  date: boolean
  aroma: boolean
}
export type ChoiceSection = {
  source: string | null
  nameSection: string | null
}
export type ChoiceClip = string | null
export type MemorySection = { section: string | null; id: string | null }
export type FullCardPersonalId = {
  shopping: string | null
  blanks: string | null
}
export type BtnToolbar = {
  firstBtn: string | null
  secondBtn: string | null
  section: string | null
}
export type MemoryCardInfo = {
  source: 'sender' | 'recipient'
  id: number | string
}
