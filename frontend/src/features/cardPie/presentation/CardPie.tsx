import React from 'react'
import clsx from 'clsx'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import listOfMonthOfYear from '@data/date/monthOfYear.json'
import {
  IconUserRecipient,
  IconUsers,
  IconLogo,
  IconSectionMenuCardphoto,
  IconSectionMenuCardtext,
  IconSectionMenuEnvelopeV2,
  IconSectionMenuAromaV2,
  IconSectionMenuDate,
  IconCalendarMulti,
} from '@shared/ui/icons'
import type { DispatchDate } from '@entities/date'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { CardSection } from '@shared/config/constants'
import { useToolbarFacade } from '@toolbar/application/facades'
import { getToolbarIcon } from '@shared/utils/icons'
import { CARDTEXT_APPLIED_DISPLAY_STATUSES } from '@cardtext/domain/editor/editor.types'
import { CardPieProps } from '../domain/types'
import { useCardPieFacade } from '../application/facade'
import styles from './CardPie.module.scss'

const STROKE_WIDTH = 24
const SECTOR_STROKE = '#b3b3b3'

const PATTERN = {
  cardphoto5120: { x: -1343, y: -1344 },
  cardtext5120: { x: 863, y: -1693 },
  date5120: { x: -1693, y: 863 },
  envelope2560: { x: 3120, y: 1577 },
  aroma2560: { x: 1300, y: 2750 },
} as const

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
  const { actions: editorPieActions } = useToolbarFacade('editorPie')

  const cardData = data?.data
  const cardtextStatus = cardData?.cardtext?.status
  const hasAppliedCardtext =
    cardtextStatus != null &&
    CARDTEXT_APPLIED_DISPLAY_STATUSES.has(cardtextStatus)
  const valueCardtext = hasAppliedCardtext
    ? (cardData?.cardtext?.value ?? [])
    : []
  const previewLines = valueCardtext
    .slice(0, 8)
    .map((block) => {
      const fullLineText = block.children.map((child) => child.text).join('')
      return fullLineText.split(/\s+/).filter(Boolean).slice(0, 4).join(' ')
    })
    .filter((line) => line.length > 0)
  const cardtextColorKey = cardData?.cardtext?.style?.color ?? 'forestGreen'
  const cardtextFillVar = `var(--color-font-${cardtextColorKey})`
  const photoUrl = sections.cardphoto
    ? (cardData?.cardphoto?.previewUrl ?? null)
    : null
  const aromaIndex = cardData?.aroma?.index
  const aromaImageUrl =
    aromaIndex != null ? (AROMA_IMAGES[aromaIndex] ?? null) : null
  const recipient = cardData?.recipient ? cardData?.recipient : null
  const recipientCount: number =
    (cardData as any)?.recipientCount ?? (recipient ? 1 : 0)
  const isSingleRecipient = recipientCount === 1
  const hasManyRecipients = recipientCount > 1
  const date = cardData?.date ?? null
  const dates: DispatchDate[] =
    (cardData as { dates?: DispatchDate[] } | undefined)?.dates?.length
      ? ((cardData as { dates: DispatchDate[] }).dates ?? [])
      : date
        ? [date]
        : []
  const hasManyDates = dates.length > 1

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    const sectionId = e.currentTarget.dataset.section as CardSection
    if (sectionId) setHovered(sectionId)
  }
  const handleMouseLeave = () => setHovered(null)

  const allSectionsFilled = isReady
  const hasAnySectionFilled = Object.values(sections).some(Boolean)
  const showCloseButton = hasAnySectionFilled
  const hasAllOtherSectionsFilled =
    sections.cardphoto &&
    sections.cardtext &&
    sections.envelope &&
    sections.aroma

  const showFavoriteButton =
    allSectionsFilled || (!sections.date && Boolean(hasAllOtherSectionsFilled))

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
      {showFavoriteButton && (
        <button
          type="button"
          className={styles.pieFavoriteButton}
          aria-label="Favorite"
          title="Favorite"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!allSectionsFilled) return
            editorPieActions.onAction('favorite')
          }}
        >
          <span className={styles.pieFavoriteStarOuter}>★</span>
          <span className={styles.pieFavoriteStarInner}>★</span>
        </button>
      )}

      {showCloseButton && (
        <button
          type="button"
          className={styles.pieCloseButton}
          aria-label="Close"
          title="Close"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            editorPieActions.onAction('close')
          }}
        >
          {getToolbarIcon({ key: 'clearInput' })}
        </button>
      )}

      <div className={styles.pieContent}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          width="512"
          height="512"
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
              width="5120"
              height="5120"
              x={PATTERN.cardphoto5120.x}
              y={PATTERN.cardphoto5120.y}
            >
              <rect
                width="5120"
                height="5120"
                className={clsx(
                  styles.rect,
                  styles.rectCardphoto,
                  styles.rectEmpty,
                )}
              />
              <g
                className={styles.pieSectorIconBg}
                transform={`translate(2560, 2560) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
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
              width="5120"
              height="5120"
              x={PATTERN.cardtext5120.x}
              y={PATTERN.cardtext5120.y}
            >
              {previewLines.length > 0 ? (
                <>
                  <rect
                    width="5120"
                    height="5120"
                    className={clsx(styles.rect, styles.rectCardtext)}
                    fill="var(--pie-rect-fill)"
                  />
                  <text
                    x="0"
                    y="2100"
                    textAnchor="start"
                    className={styles.pieTextBase}
                    fill={cardtextFillVar}
                    style={{ fontStyle: 'italic' }}
                  >
                    {previewLines.map((line, i) => {
                      const currentOpacity = Math.max(1 - i * 0.1, 0.4)
                      return (
                        <tspan
                          key={i}
                          x="1400"
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
                    width="5120"
                    height="5120"
                    className={clsx(
                      styles.rect,
                      styles.rectCardtext,
                      styles.rectEmpty,
                    )}
                  />
                  <g
                    className={styles.pieSectorIconBg}
                    transform={`translate(2560, 2560) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                  >
                    <IconSectionMenuCardtext
                      width={PIE_EMPTY_ICON_SIZE}
                      height={PIE_EMPTY_ICON_SIZE}
                    />
                  </g>
                  {/* <text x="100" y="600" fill="#064e3b" opacity="0.5">
                  <tspan>Hi...</tspan>
                </text> */}
                </>
              )}
            </pattern>

            <pattern
              id="envelope-fill"
              patternUnits="userSpaceOnUse"
              width="5120"
              height="5120"
              x={PATTERN.envelope2560.x}
              y={PATTERN.envelope2560.y}
            >
              {!sections.envelope ? (
                <>
                  <rect
                    width="5120"
                    height="5120"
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
                  <rect width="5120" height="5120" className={styles.rect} />
                  <IconUsers
                    x="0"
                    y="300"
                    width="2560"
                    height="2560"
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
                  <rect width="5120" height="5120" className={styles.rect} />
                  <IconUserRecipient
                    x="0"
                    y="300"
                    width="2560"
                    height="2560"
                    className={styles.pieEnvelopeIconBg}
                  />
                  <text
                    x="200"
                    y="1100"
                    textAnchor="middle"
                    strokeLinejoin="round"
                    fill="var(--envelope-text)"
                  >
                    <tspan x="600" dy="0" fontWeight="600" fontSize="650">
                      {recipient.name}
                    </tspan>
                    <tspan x="600" dy="750" fontWeight="600" fontSize="400">
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
              width="5120"
              height="5120"
              x={PATTERN.aroma2560.x}
              y={PATTERN.aroma2560.y}
            >
              {aromaImageUrl ? (
                <>
                  <rect
                    width="5120"
                    height="5120"
                    className={clsx(styles.rect, styles.rectAroma)}
                    fill="var(--pie-rect-fill)"
                  />
                  <image
                    href={aromaImageUrl}
                    width="4000"
                    height="4000"
                    x="-270"
                    y="-270"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </>
              ) : (
                <>
                  <rect
                    width="3700"
                    height="3700"
                    className={clsx(
                      styles.rect,
                      styles.rectAroma,
                      styles.rectEmpty,
                    )}
                  />
                  <g
                    className={styles.pieSectorIconBg}
                    transform={`translate(1550, 1550) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
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
              width="5120"
              height="5120"
              x={PATTERN.date5120.x}
              y={PATTERN.date5120.y}
            >
              {hasManyDates ? (
                <>
                  <rect
                    width="5120"
                    height="5120"
                    className={clsx(styles.rect, styles.rectDate)}
                    fill="var(--pie-rect-fill)"
                  />
                  <IconCalendarMulti
                    x="400"
                    y="600"
                    width="2200"
                    height="2200"
                    className={styles.pieEnvelopeIconBg}
                  />
                  <text
                    x="2560"
                    y="3200"
                    textAnchor="middle"
                    strokeLinejoin="round"
                    className={clsx(styles.pieTextBase, styles.pieTextDate)}
                  >
                    <tspan x="2560" dy="0" fontWeight="700" fontSize="1500">
                      {dates.length}
                    </tspan>
                  </text>
                </>
              ) : date ? (
                <>
                  <rect
                    width="5120"
                    height="5120"
                    className={clsx(styles.rect, styles.rectDate)}
                    fill="var(--pie-rect-fill)"
                  />
                  <text
                    x="2560"
                    y="2000"
                    textAnchor="middle"
                    strokeLinejoin="round"
                    className={clsx(styles.pieTextBase, styles.pieTextDate)}
                  >
                    <tspan x="2780" dy="0" fontWeight="400" fontSize="550">
                      {date.year}
                    </tspan>
                    <tspan x="2780" dy="1250" fontWeight="600" fontSize="1400">
                      {date.day}
                    </tspan>
                    <tspan x="2780" dy="600" fontSize="550">
                      {listOfMonthOfYear[date.month]}
                    </tspan>
                  </text>
                </>
              ) : (
                <>
                  <rect
                    width="5120"
                    height="5120"
                    className={clsx(
                      styles.rect,
                      styles.rectDate,
                      styles.rectEmpty,
                    )}
                  />
                  <g
                    className={styles.pieSectorIconBg}
                    transform={`translate(2560, 2560) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
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

          <g id="pie-layers">
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
              d="M5110 5110H1261l1299-2550z"
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
              d="M1261 5110H10V2156l2550 404z"
              onClick={() => handleSectorClick('date')}
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
              d="M5110 5110 2560 2560l2550-1299z"
              onClick={() => handleSectorClick('envelope')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
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
              d="M10 2156V10h2146l404 2550z"
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
              d="M5110 1261 2560 2560 2156 10h2954z"
              onClick={() => handleSectorClick('cardtext')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />

            {/* <path
              id="aroma-bg"
              className={styles.sectorBg}
              fill="none"
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M2182 3725h1350v1350H2182z"
            /> */}
            {/* <path id="cardphoto-bg" className={styles.sectorBg} fill="none" stroke={SECTOR_STROKE} strokeWidth={STROKE_WIDTH} d="M542 541h1350v1350H542z" /> */}
            {/* <path id="envelope-bg" className={styles.sectorBg} fill="none" stroke={SECTOR_STROKE} strokeWidth={STROKE_WIDTH} d="M3725 2182h1350v1350H3725z" /> */}
            {/* <path id="date-bg" className={styles.sectorBg} fill="none" stroke={SECTOR_STROKE} strokeWidth={STROKE_WIDTH} d="M192 2748h1350v1350H192z" /> */}
            {/* <path id="cardtext-bg" className={styles.sectorBg} fill="none" stroke={SECTOR_STROKE} strokeWidth={STROKE_WIDTH} d="M2748 192h1350v1350H2748z" /> */}
          </g>
        </svg>
      </div>
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
          allSectionsFilled && styles.pieCenterButtonActive,
        )}
        disabled={!allSectionsFilled}
        aria-label="Hi.post"
      >
        <span
          className={clsx(
            styles.pieCenterIcon,
            allSectionsFilled && styles.pieCenterIconBrand,
          )}
        >
          <IconLogo aria-hidden />
        </span>
      </button>
    </div>
  )
}
