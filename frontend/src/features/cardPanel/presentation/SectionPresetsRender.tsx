// @features/cardPanel/presentation/SectionPresetsRenderer.tsx
import React from 'react'
import { SectionPresets } from '../SectionPresets/presentation/SectionPresets'

interface Props {
  choiceClip: string | null
  sizeMiniCard: { width: number; height: number }
  widthCardsList: number
  valueScroll: number
  setValueScroll: (v: number) => void
  setInfoCardsList: (v: number | null) => void
}

export const SectionPresetsRenderer: React.FC<Props> = ({
  choiceClip,
  sizeMiniCard,
  widthCardsList,
  valueScroll,
  setValueScroll,
  setInfoCardsList,
}) => {
  const presetSections = ['cart', 'drafts', 'recipient', 'sender', 'date']
  if (!choiceClip || !presetSections.includes(choiceClip)) return null

  return (
    <SectionPresets
      sizeMiniCard={sizeMiniCard}
      widthCardsList={widthCardsList}
      setInfoCardsList={setInfoCardsList}
      valueScroll={valueScroll}
      setValueScroll={setValueScroll}
    />
  )
}
