// src/types/layout.ts

export interface ChoiceSection {
  nameSection: string
  // можно добавить: label, icon, или другие свойства
}

export interface ChoiceClip {
  clipId: string
  // если есть координаты или параметры — добавь их
}

export interface SizeCard {
  width: number
  height: number
}
