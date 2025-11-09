import React, { useRef } from 'react'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import {
  useSectionPresets,
  useSectionPresetsPositioning,
  useSectionPresetsActions,
  useSectionPresetsScroll,
} from '../application/hooks'
import { PresetCard } from './PresetCard'
import { PresetToolbar } from './PresetToolbar'
import { PresetAddress } from './PresetAddress'
import styles from './SectionPresets.module.scss'
import type { Template } from '@shared/config/constants'
// import type { InfoCardsList } from '../../CardScroller/domain/types'

interface Props {
  widthCardsList: number
  // setScrollIndex: (info: { length: number; firstLetters: any[] }) => void
  valueScroll: number
  setValueScroll: (value: number) => void
}

export const SectionPresets: React.FC<Props> = ({
  widthCardsList,
  // setScrollIndex,
  valueScroll,
  setValueScroll,
}) => {
  const { size, ui } = useLayoutFacade()
  const { remSize, sizeMiniCard } = size
  // const { selectedTemplate } = ui

  const { state } = useLayoutNavFacade()
  const { selectedTemplate } = state

  const cardRefs = useRef<Record<string, HTMLElement | null>>({})
  const filterRefs = useRef<Record<string, HTMLElement | null>>({})
  const btnIconRefs = useRef<Record<string, HTMLElement | null>>({})
  const spanNameRefs = useRef<Record<string, HTMLElement | null>>({})

  if (!selectedTemplate) return null

  const { sectionPresets, letterIndexList } =
    useSectionPresets(selectedTemplate)

  const { movingCards } = useSectionPresetsPositioning(
    sectionPresets,
    sizeMiniCard,
    letterIndexList
  )
  const { handleClickCard, handleBtnCardClick } = useSectionPresetsActions(
    selectedTemplate,
    sectionPresets,
    () => useSectionPresets(selectedTemplate)
  )

  useSectionPresetsScroll(movingCards)

  const source: Template[] = ['cart', 'drafts']

  return (
    <div className={styles['section-presets']}>
      {sectionPresets.map((card, index) => (
        <div key={card.id}>
          <PresetCard
            card={card}
            index={index}
            section={selectedTemplate}
            size={sizeMiniCard}
            remSize={remSize}
            refs={{
              cardRef: (el) => (cardRefs.current[`card-${index}`] = el),
              filterRef: source.includes(selectedTemplate)
                ? (el) => (filterRefs.current[`filter-${card.id}`] = el)
                : undefined,
              spanNameRef:
                selectedTemplate === 'recipient'
                  ? (el) => (spanNameRefs.current[`span-name-${index}`] = el)
                  : undefined,
            }}
            onClick={handleClickCard}
          />

          {(selectedTemplate === 'sender' ||
            selectedTemplate === 'recipient') && (
            <PresetAddress
              name={card.address.name}
              country={card.address.country}
              section={selectedTemplate}
              spanRef={
                selectedTemplate === 'recipient'
                  ? (el) => (spanNameRefs.current[`span-name-${index}`] = el)
                  : undefined
              }
            />
          )}

          {source.includes(selectedTemplate) && (
            <PresetToolbar
              cardId={card.id}
              buttons={['save', 'remove', 'addCart']}
              remSize={remSize}
              onClick={handleBtnCardClick}
              setRef={(btn, el) =>
                (btnIconRefs.current[`fullCard-${btn}`] = el)
              }
            />
          )}
        </div>
      ))}
    </div>
  )
}
