import React from 'react'
import { SectionPresets } from '../SectionPresets/presentation/SectionPresets'
import type { Template } from '@shared/config/constants'

interface Props {
  selectedTemplate: Template | null
  widthCardsList: number
  valueScroll: number
  setValueScroll: (v: number) => void
  // setScrollIndex: (v: InfoCardsList | null) => void
}

export const SectionPresetsRenderer: React.FC<Props> = ({
  selectedTemplate,
  widthCardsList,
  valueScroll,
  setValueScroll,
  // setScrollIndex,
}) => {
  const presetSections = ['cart', 'drafts', 'recipient', 'sender', 'date']
  if (!selectedTemplate || !presetSections.includes(selectedTemplate))
    return null

  return (
    <SectionPresets
      widthCardsList={widthCardsList}
      // setScrollIndex={setScrollIndex}
      valueScroll={valueScroll}
      setValueScroll={setValueScroll}
    />
  )
}
