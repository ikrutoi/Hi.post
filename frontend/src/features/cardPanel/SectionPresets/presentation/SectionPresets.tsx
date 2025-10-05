import React, { useRef } from 'react'
import styles from './SectionPresets.module.scss'

import { useAppSelector } from '@app/hooks'
import { useSectionPresets } from '../application/hooks/useSectionPresets'
import { useSectionPresetsPositioning } from '../application/hooks/useSectionPresetsPositioning'
import { useSectionPresetsActions } from '../application/hooks/useSectionPresetsActions'
import { useSectionPresetsScroll } from '../application/hooks/useSectionPresetsScroll'
import { PresetCard } from './PresetCard'
import { PresetToolbar } from './PresetToolbar'
import { PresetAddress } from './PresetAddress'
import { PresetSource } from '../domain/types'

interface Props {
  sizeMiniCard: { width: number; height: number }
  widthCardsList: number
  setInfoCardsList: (info: { length: number; firstLetters: any[] }) => void
  valueScroll: number
  setValueScroll: (value: number) => void
}

export const SectionPresets: React.FC<Props> = ({
  sizeMiniCard,
  widthCardsList,
  setInfoCardsList,
  valueScroll,
  setValueScroll,
}) => {
  const remSize = useAppSelector((state) => state.layout.remSize)
  const source = useAppSelector((state) => state.layout.setChoiceClip)

  const cardRefs = useRef<Record<string, HTMLElement | null>>({})
  const filterRefs = useRef<Record<string, HTMLElement | null>>({})
  const btnIconRefs = useRef<Record<string, HTMLElement | null>>({})
  const spanNameRefs = useRef<Record<string, HTMLElement | null>>({})

  const { sectionPresets, firstLetterList, sectionClip } =
    useSectionPresets(source)
  const { movingCards } = useSectionPresetsPositioning(
    sectionPresets,
    remSize,
    sizeMiniCard,
    cardRefs
  )
  const { handleClickCard, handleBtnCardClick } = useSectionPresetsActions(
    sectionClip,
    sectionPresets,
    () => useSectionPresets(source)
  )
  useSectionPresetsScroll(movingCards)

  const memorySections: PresetSource[] = ['cart', 'drafts']

  return (
    <div className={styles['section-presets']}>
      {sectionPresets.map((card, index) => (
        <div key={card.id}>
          <PresetCard
            card={card}
            index={index}
            section={sectionClip}
            size={sizeMiniCard}
            remSize={remSize}
            refs={{
              cardRef: (el) => (cardRefs.current[`card-${index}`] = el),
              filterRef: memorySections.includes(sectionClip)
                ? (el) => (filterRefs.current[`filter-${card.id}`] = el)
                : undefined,
              spanNameRef:
                sectionClip === 'recipient'
                  ? (el) => (spanNameRefs.current[`span-name-${index}`] = el)
                  : undefined,
            }}
            onClick={handleClickCard}
          />

          {(sectionClip === 'sender' || sectionClip === 'recipient') && (
            <PresetAddress
              name={card.address.name}
              country={card.address.country}
              section={sectionClip}
              spanRef={
                sectionClip === 'recipient'
                  ? (el) => (spanNameRefs.current[`span-name-${index}`] = el)
                  : undefined
              }
            />
          )}

          {memorySections.includes(sectionClip) && (
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
