import React from 'react'
import clsx from 'clsx'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import listOfMonthOfYear from '@data/date/monthOfYear.json'
import {
  IconUserRecipient,
  IconUsers,
  IconSectionMenuCardphoto,
  IconSectionMenuCardtext,
  IconSectionMenuEnvelopeV2,
  IconSectionMenuAromaV2,
  IconSectionMenuDate,
} from '@shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { CardSection } from '@shared/config/constants'
import { CardPieProps } from '../domain/types'
import { useCardPieFacade } from '../application/facade'
import styles from './CardPie.module.scss'

const STROKE_WIDTH = 9.99216
const SECTOR_STROKE = '#b3b3b3'

const PIE_EMPTY_ICON_SIZE = 1440
const PIE_EMPTY_ICON_HALF = PIE_EMPTY_ICON_SIZE / 2

export const CardPie: React.FC<CardPieProps> = ({
  status,
  id,
  fillContainer = false,
}) => {
  const photoFillId = React.useId().replace(/:/g, '')
  const photoEmptyFillId = React.useId().replace(/:/g, '')
  const { data, sections, handleSectorClick, isReady } = useCardPieFacade(
    status,
    id,
  )
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, hoveredSection } = useCardEditorFacade()

  const cardData = data?.data
  const hasAppliedCardtext = cardData?.cardtext?.applied != null
  const valueCardtext = hasAppliedCardtext
    ? cardData?.cardtext?.value || []
    : []
  const previewLines = valueCardtext
    .slice(0, 6)
    .map((block) => {
      const fullLineText = block.children.map((child) => child.text).join('')
      return fullLineText.split(/\s+/).filter(Boolean).slice(0, 4).join(' ')
    })
    .filter((line) => line.length > 0)
  const photoUrl = sections.cardphoto
    ? (cardData?.cardphoto?.previewUrl ?? null)
    : null
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

  const allSectionsFilled = isReady

  return (
    <div
      className={clsx(
        styles.hubContainer,
        allSectionsFilled && styles.pieAllComplete,
        fillContainer && styles.hubContainerFill,
      )}
      style={
        fillContainer
          ? undefined
          : {
              height: `${sizeMiniCard.height}px`,
              width: `${sizeMiniCard.height}px`,
            }
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5120 5120"
        className={styles.svg}
        fillRule="evenodd"
        clipRule="evenodd"
        imageRendering="optimizeQuality"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        <defs>
          {sections.cardphoto && photoUrl && (
            <pattern
              id={photoFillId}
              patternUnits="objectBoundingBox"
              patternContentUnits="objectBoundingBox"
              x="0"
              y="0"
              width="1"
              height="1"
            >
              <image
                href={photoUrl}
                x="0"
                y="0"
                width="1"
                height="1"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          )}
          <pattern
            id={photoEmptyFillId}
            patternUnits="userSpaceOnUse"
            width="2560"
            height="2560"
            x="1280"
            y="320"
          >
            <rect
              width="2560"
              height="2560"
              className={clsx(
                styles.rect,
                styles.rectCardphoto,
                styles.rectEmpty,
              )}
            />
            <g
              className={styles.pieSectorIconBg}
              transform={`translate(1280, 1280) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
            >
              <IconSectionMenuCardphoto
                width={PIE_EMPTY_ICON_SIZE}
                height={PIE_EMPTY_ICON_SIZE}
              />
            </g>
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
                  fill="var(--pie-rect-fill)"
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
                  className={clsx(
                    styles.rect,
                    styles.rectCardtext,
                    styles.rectEmpty,
                  )}
                />
                <g
                  className={styles.pieSectorIconBg}
                  transform={`translate(1280, 1567.5) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                >
                  <IconSectionMenuCardtext
                    width={PIE_EMPTY_ICON_SIZE}
                    height={PIE_EMPTY_ICON_SIZE}
                  />
                </g>
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
            {!sections.envelope ? (
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(
                    styles.rect,
                    styles.rectEnvelope,
                    styles.rectEmpty,
                  )}
                />
                <g
                  className={styles.pieSectorIconBg}
                  transform={`translate(1280, 1280) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                >
                  <IconSectionMenuEnvelopeV2
                    width={PIE_EMPTY_ICON_SIZE}
                    height={PIE_EMPTY_ICON_SIZE}
                  />
                </g>
              </>
            ) : hasManyRecipients ? (
              <>
                <rect width="2560" height="2560" className={styles.rect} />
                <IconUsers
                  x="400"
                  y="400"
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
                </text>
              </>
            ) : recipient ? (
              <>
                <rect width="2560" height="2560" className={styles.rect} />
                <IconUserRecipient
                  x="400"
                  y="440"
                  width="2200"
                  height="2200"
                  className={styles.pieEnvelopeIconBg}
                />
                <text
                  x="200"
                  y="1100"
                  textAnchor="start"
                  strokeLinejoin="round"
                  fill="var(--envelope-text)"
                >
                  <tspan x="200" dy="0" fontWeight="600" fontSize="650">
                    {recipient.name}
                  </tspan>
                  <tspan x="200" dy="750" fontWeight="600" fontSize="400">
                    {recipient.country ?? recipient.city}
                  </tspan>
                </text>
              </>
            ) : (
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(
                    styles.rect,
                    styles.rectEnvelope,
                    styles.rectEmpty,
                  )}
                />
                <g
                  className={styles.pieSectorIconBg}
                  transform={`translate(1280, 1280) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                >
                  <IconSectionMenuEnvelopeV2
                    width={PIE_EMPTY_ICON_SIZE}
                    height={PIE_EMPTY_ICON_SIZE}
                  />
                </g>
              </>
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
                  fill="var(--pie-rect-fill)"
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
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(
                    styles.rect,
                    styles.rectAroma,
                    styles.rectEmpty,
                  )}
                />
                <g
                  className={styles.pieSectorIconBg}
                  transform={`translate(1280, 1280) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                >
                  <IconSectionMenuAromaV2
                    width={PIE_EMPTY_ICON_SIZE}
                    height={PIE_EMPTY_ICON_SIZE}
                  />
                </g>
              </>
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
                  fill="var(--pie-rect-fill)"
                />
                <text
                  x="1280"
                  y="750"
                  textAnchor="middle"
                  strokeLinejoin="round"
                  className={clsx(styles.pieTextBase, styles.pieTextDate)}
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
              <>
                <rect
                  width="2560"
                  height="3135"
                  className={clsx(
                    styles.rect,
                    styles.rectDate,
                    styles.rectEmpty,
                  )}
                />
                <g
                  className={styles.pieSectorIconBg}
                  transform={`translate(1280, 1567.5) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                >
                  <IconSectionMenuDate
                    width={PIE_EMPTY_ICON_SIZE}
                    height={PIE_EMPTY_ICON_SIZE}
                  />
                </g>
              </>
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
            fill={
              sections.cardphoto && photoUrl
                ? `url(#${photoFillId})`
                : `url(#${photoEmptyFillId})`
            }
            stroke={SECTOR_STROKE}
            strokeWidth={STROKE_WIDTH}
            d="m2560 2560 1657 2550H903z"
            onClick={() => handleSectorClick('cardphoto')}
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
            d="M4217 5110 2560 2560l2550-573v3123z"
            onClick={() => handleSectorClick('date')}
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
            d="M10 1987v3123h893l1657-2550z"
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
            d="M2560 2560 10 1987V10h2550z"
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
            d="M2560 2560V10h2550v1977z"
            onClick={() => handleSectorClick('aroma')}
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
        aria-label="Add to cart"
      >
        <span className={styles.pieCenterIcon}>
          {getToolbarIcon({ key: 'addCart' })}
        </span>
      </button>
    </div>
  )
}
