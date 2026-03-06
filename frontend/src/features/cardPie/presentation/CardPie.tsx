import React from 'react'
import clsx from 'clsx'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import listOfMonthOfYear from '@data/date/monthOfYear.json'
import { IconUserRecipient, IconUsers } from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { CardSection } from '@shared/config/constants'
import { CardPieProps } from '../domain/types'
import { useCardPieFacade } from '../application/facade'
import styles from './CardPie.module.scss'

const STROKE_WIDTH = 23.6221
const SECTOR_STROKE = '#999'

export const CardPie: React.FC<CardPieProps> = ({ status, id }) => {
  const { data, sections, handleSectorClick } = useCardPieFacade(status, id)
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, hoveredSection } = useCardEditorFacade()

  const cardData = data?.data
  const valueCardtext = cardData?.cardtext?.value || []
  const previewLines = valueCardtext
    .slice(0, 6)
    .map((block) => {
      const fullLineText = block.children.map((child) => child.text).join('')
      return fullLineText.split(/\s+/).filter(Boolean).slice(0, 4).join(' ')
    })
    .filter((line) => line.length > 0)
  const photoUrl = cardData?.cardphoto.previewUrl
  const aromaIndex = cardData?.aroma?.index
  const aromaImageUrl = aromaIndex ? AROMA_IMAGES[aromaIndex] : null
  const recipient = cardData?.recipient ? cardData?.recipient : null
  const recipientCount: number =
    (cardData as any)?.recipientCount ?? (recipient ? 1 : 0)
  const isSingleRecipient = recipientCount === 1
  const hasManyRecipients = recipientCount > 1
  const date = cardData?.date

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    const sectionId = e.currentTarget.dataset.section as CardSection
    if (sectionId) setHovered(sectionId)
  }
  const handleMouseLeave = () => setHovered(null)

  const allSectionsFilled =
    sections.cardphoto &&
    sections.cardtext &&
    sections.envelope &&
    sections.aroma &&
    sections.date

  return (
    <div
      className={clsx(
        styles.hubContainer,
        allSectionsFilled && styles.pieAllComplete,
      )}
      style={{
        height: `${sizeMiniCard.height}px`,
        width: `${sizeMiniCard.height}px`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="60 60 5000 5000"
        className={styles.svg}
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <defs>
          <pattern
            id="photo-fill"
            patternUnits="userSpaceOnUse"
            width="2560"
            height="2560"
            x="1280"
            y="2560"
          >
            {photoUrl ? (
              <image
                href={photoUrl}
                width="2560"
                height="2560"
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <rect
                width="2560"
                height="2560"
                className={clsx(styles.rect, styles.rectCardphoto)}
              />
            )}
          </pattern>

          <pattern
            id="cardtext-fill"
            patternUnits="userSpaceOnUse"
            width="2560"
            height="3135"
            x="0"
            y="2000"
          >
            {previewLines.length > 0 ? (
              <>
                <rect
                  width="2560"
                  height="3135"
                  className={clsx(styles.rect, styles.rectCardtext)}
                />
                <text
                  x="100"
                  y="400"
                  textAnchor="start"
                  className={styles.pieTextBase}
                  fill="#064e3b"
                  style={{ fontStyle: 'italic' }}
                >
                  {previewLines.map((line, i) => {
                    const currentOpacity = Math.max(1 - i * 0.15, 0.4)
                    return (
                      <tspan
                        key={i}
                        x="100"
                        dy={i === 0 ? 0 : 500}
                        fontWeight="400"
                        fontSize={350 - i * 5}
                        opacity={currentOpacity}
                      >
                        {line}
                      </tspan>
                    )
                  })}
                </text>
              </>
            ) : (
              <>
                <rect
                  width="2560"
                  height="3135"
                  className={clsx(styles.rect, styles.rectCardtext)}
                />
                <text x="100" y="600" fill="#064e3b" opacity="0.5">
                  <tspan>Hi...</tspan>
                </text>
              </>
            )}
          </pattern>

          <pattern
            id="envelope-fill"
            patternUnits="userSpaceOnUse"
            width="2560"
            height="2560"
            x="0"
            y="0"
          >
            {hasManyRecipients ? (
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(styles.rect, styles.rectEnvelope)}
                />
                <IconUsers
                  x="400"
                  y="440"
                  width="2200"
                  height="2200"
                  className={styles.pieEnvelopeIconBg}
                />
                <text
                  x="1280"
                  y="1400"
                  textAnchor="middle"
                  strokeLinejoin="round"
                  fill="var(--envelope-text)"
                >
                  <tspan x="1280" dy="250" fontWeight="700" fontSize="1500">
                    {recipientCount}
                  </tspan>
                  {/* <tspan x="1280" dy="650" fontWeight="500" fontSize="500">
                    recipients
                  </tspan> */}
                </text>
              </>
            ) : recipient ? (
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(styles.rect, styles.rectEnvelope)}
                />
                <IconUserRecipient
                  x="400"
                  y="440"
                  width="2200"
                  height="2200"
                  className={styles.pieEnvelopeIconBg}
                />
                <text
                  x="1280"
                  y="1100"
                  textAnchor="middle"
                  strokeLinejoin="round"
                  fill="var(--envelope-text)"
                >
                  <tspan x="1280" dy="0" fontWeight="600" fontSize="650">
                    {recipient.name}
                  </tspan>
                  <tspan x="1280" dy="750" fontWeight="600" fontSize="400">
                    {recipient.country ?? recipient.city}
                  </tspan>
                </text>
              </>
            ) : (
              <rect
                width="2560"
                height="2560"
                className={clsx(styles.rect, styles.rectEnvelope)}
              />
            )}
          </pattern>

          <pattern
            id="aroma-fill"
            patternUnits="userSpaceOnUse"
            width="2560"
            height="2560"
            x="2560"
            y="2560"
          >
            {aromaImageUrl ? (
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(styles.rect, styles.rectAroma)}
                />
                <image
                  href={aromaImageUrl}
                  width="2560"
                  height="2560"
                  x="0"
                  y="256"
                  preserveAspectRatio="xMidYMid meet"
                />
              </>
            ) : (
              <rect
                width="2560"
                height="2560"
                className={clsx(styles.rect, styles.rectAroma)}
              />
            )}
          </pattern>

          <pattern
            id="date-fill"
            patternUnits="userSpaceOnUse"
            width="2560"
            height="3135"
            x="0"
            y="2000"
          >
            {date ? (
              <>
                <rect
                  width="2560"
                  height="3135"
                  className={clsx(styles.rect, styles.rectDate)}
                />
                <text
                  x="1280"
                  y="750"
                  textAnchor="middle"
                  strokeLinejoin="round"
                  fill="hsl(207, 70%, 47%)"
                >
                  <tspan x="1280" dy="0" fontWeight="400" fontSize="550">
                    {date.year}
                  </tspan>
                  <tspan x="1280" dy="1250" fontWeight="600" fontSize="1400">
                    {date.day}
                  </tspan>
                  <tspan x="1280" dy="600" fontSize="550">
                    {listOfMonthOfYear[date.month]}
                  </tspan>
                </text>
              </>
            ) : (
              <rect
                width="2560"
                height="3135"
                className={clsx(styles.rect, styles.rectDate)}
              />
            )}
          </pattern>
        </defs>

        <g>
          <path
            id="cardphoto"
            data-section="cardphoto"
            className={clsx(
              styles.sector,
              !sections.cardphoto && styles.sectorEmpty,
              hoveredSection === 'cardphoto' && styles.hovered,
            )}
            fill="url(#photo-fill)"
            stroke={SECTOR_STROKE}
            strokeWidth={STROKE_WIDTH}
            d="m2560 2560 1647 2535H913z"
            onClick={() => handleSectorClick('cardphoto')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <path
            id="cardtext"
            data-section="cardtext"
            className={clsx(
              styles.sector,
              !sections.cardtext && styles.sectorEmpty,
              hoveredSection === 'cardtext' && styles.hovered,
            )}
            fill="url(#cardtext-fill)"
            stroke={SECTOR_STROKE}
            strokeWidth={STROKE_WIDTH}
            d="m913 5095 1647-2535L25 1991v2347c0 417 340 757 757 757z"
            onClick={() => handleSectorClick('cardtext')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <path
            id="envelope"
            data-section="envelope"
            className={clsx(
              styles.sector,
              !sections.envelope && styles.sectorEmpty,
              hoveredSection === 'envelope' && styles.hovered,
            )}
            fill="url(#envelope-fill)"
            stroke={SECTOR_STROKE}
            strokeWidth={STROKE_WIDTH}
            d="M2560 25H782C365 25 25 365 25 782v1209l2535 569z"
            onClick={() => handleSectorClick('envelope')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <path
            id="aroma"
            data-section="aroma"
            className={clsx(
              styles.sector,
              !sections.aroma && styles.sectorEmpty,
              hoveredSection === 'aroma' && styles.hovered,
            )}
            fill="url(#aroma-fill)"
            stroke={SECTOR_STROKE}
            strokeWidth={STROKE_WIDTH}
            d="M5095 1991V782c0-417-340-757-757-757H2560v2535z"
            onClick={() => handleSectorClick('aroma')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <path
            id="date"
            data-section="date"
            className={clsx(
              styles.sector,
              !sections.date && styles.sectorEmpty,
              hoveredSection === 'date' && styles.hovered,
            )}
            fill="url(#date-fill)"
            stroke={SECTOR_STROKE}
            strokeWidth={STROKE_WIDTH}
            d="m5095 1991-2535 569 1647 2535h131c417 0 757-340 757-757z"
            onClick={() => handleSectorClick('date')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </g>
      </svg>
      <div
        className={clsx(
          styles.pieOutlineOverlay,
          hoveredSection && styles.pieOutlineOverlayHovered,
        )}
        aria-hidden
      />
      <button
        type="button"
        className={clsx(
          styles.pieCenterButton,
          allSectionsFilled && styles.pieCenterButtonEnabled,
        )}
        disabled={!allSectionsFilled}
        aria-label="Добавить в корзину"
      >
        <span className={styles.pieCenterIcon}>
          {getToolbarIcon({ key: 'addCart' })}
        </span>
      </button>
    </div>
  )
}
