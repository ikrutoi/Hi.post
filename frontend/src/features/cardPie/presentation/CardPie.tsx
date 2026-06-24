import React from 'react'
import clsx from 'clsx'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import { MONTH_NAMES } from '@entities/date/constants'
import {
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
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import { useSizeFacade } from '@layout/application/facades'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { CardSection } from '@shared/config/constants'
import { CARDTEXT_APPLIED_DISPLAY_STATUSES } from '@cardtext/domain/editor/editor.types'
import { CardPieProps } from '../domain/types'
import { useCardPieFacade } from '../application/facade'
import { isPostcardPieAllComplete } from '../infrastructure/postcardCardPieViewModel'
import {
  PIE_DATE_SCATTER_SLOTS,
  PIE_ENVELOPE_SCATTER_SLOTS,
  PIE_ENVELOPE_PATTERN_HEIGHT,
  PIE_ENVELOPE_PATTERN_WIDTH,
  PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT,
  PIE_ENVELOPE_SENDER_CIRCLE_LAYOUT,
  expandEnvelopeRecipientsForBg,
} from '../domain/pieScatteredBackground'
import { PieScatteredBackgroundText } from './PieScatteredBackgroundText'
import styles from './CardPie.module.scss'

const STROKE_WIDTH = 24
const SECTOR_STROKE = '#b3b3b3'

const PATTERN = {
  cardphoto5120: { x: -1343, y: -1344 },
  cardtext5120: { x: 863, y: -1693 },
  date5120: { x: -1150, y: 863 },
  envelope2560: { x: 2560, y: 1000 },
  aroma2560: { x: 1300, y: 2750 },
} as const

const PIE_EMPTY_ICON_SIZE = 1440
const PIE_EMPTY_ICON_HALF = PIE_EMPTY_ICON_SIZE / 2
/** Empty envelope sector: icon center (1440×1440), left edge stays inside pattern. */
const PIE_ENVELOPE_EMPTY_ICON_X = 1120
const PIE_ENVELOPE_EMPTY_ICON_Y = 2000
const PIE_ENVELOPE_SECTOR_D = 'M5110 5110 2560 2560l2550-1299z'

export const CardPie: React.FC<CardPieProps> = ({
  isProcessed = false,
  status,
  id,
  fillContainer = false,
  station = 'left',
  rightListSource = null,
  onListArchiveSectorClick,
  onBeforeLeftPieSectorClick,
  onLeftPieSectorClick,
  onLeftPieCenterClick,
  leftPieCenterClickable = false,
  hideLeftPieCenterLogo = false,
  pieInner,
  pieSections,
  hideEmptySectorPlaceholders = false,
  onRightPieCenterClick,
}) => {
  const pieDefsUid = React.useId().replace(/:/g, '')
  const photoFillId = `${pieDefsUid}-photo-apply`
  const photoEmptyFillId = `${pieDefsUid}-photo-empty`
  const cardtextFillId = `${pieDefsUid}-cardtext-fill`
  const envelopeFillId = `${pieDefsUid}-envelope-fill`
  const aromaFillId = `${pieDefsUid}-aroma-fill`
  const dateFillId = `${pieDefsUid}-date-fill`
  const listArchiveSource = station === 'right' && id ? rightListSource : null

  const usesInjectedPie = pieInner != null

  const {
    data,
    sections: facadeSections,
    handleSectorClick: defaultHandleSectorClick,
    isReady: facadeReady,
    listArchiveSource: listSourceFromFacade,
  } = useCardPieFacade(
    usesInjectedPie ? false : isProcessed,
    status,
    usesInjectedPie ? undefined : id,
    listArchiveSource,
  )
  const sections = pieSections ?? facadeSections
  const handleSectorClick =
    station === 'right' && onListArchiveSectorClick != null
      ? onListArchiveSectorClick
      : station === 'left' && onLeftPieSectorClick != null
        ? onLeftPieSectorClick
        : (section: CardSection) => {
            if (station === 'left') {
              onBeforeLeftPieSectorClick?.()
            }
            defaultHandleSectorClick(section)
          }
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, hoveredSection } = useCardEditorFacade()

  const cardData = pieInner ?? data?.data
  const isReady =
    pieSections != null ? isPostcardPieAllComplete(pieSections) : facadeReady
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
    (cardData as { recipientCount?: number } | undefined)?.recipientCount ??
    (recipient ? 1 : 0)
  const isSingleRecipient = recipientCount === 1
  const hasManyRecipients = recipientCount > 1
  const recipientPreviewLines: string[] =
    (cardData as { recipientPreviewLines?: string[] } | undefined)
      ?.recipientPreviewLines ?? []
  const hasSenderAppliedData =
    (cardData as { hasSenderAppliedData?: boolean } | undefined)
      ?.hasSenderAppliedData ?? false
  const date = cardData?.date ?? null
  const mergedFromEditor = cardData?.dates
  const dates: DispatchDate[] =
    Array.isArray(mergedFromEditor) && mergedFromEditor.length > 0
      ? mergedFromEditor
      : date
        ? [date]
        : []
  const hasManyDates = dates.length > 1
  const datePreviewLines: string[] =
    (cardData as { datePreviewLines?: string[] } | undefined)
      ?.datePreviewLines ?? dates.map((d) => String(d.day))
  const currentDate = getCurrentDate()
  const isCartDateDisabled =
    (status === 'cart' || status === 'cartBlocked') &&
    dates.length > 0 &&
    dates.every((d) => isDispatchDateDisabledForOrder(d, currentDate))

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    const sectionId = e.currentTarget.dataset.section as CardSection
    if (sectionId) setHovered(sectionId)
  }
  const handleMouseLeave = () => setHovered(null)

  const envelopeSenderCircle = hasSenderAppliedData ? (
    <circle
      cx={PIE_ENVELOPE_SENDER_CIRCLE_LAYOUT.cx}
      cy={PIE_ENVELOPE_SENDER_CIRCLE_LAYOUT.cy}
      r={PIE_ENVELOPE_SENDER_CIRCLE_LAYOUT.radius}
      className={styles.pieEnvelopeSenderCircle}
    />
  ) : null

  const allSectionsFilled = isReady
  return (
    <div
      className={clsx(
        styles.hubContainer,
        station === 'right' && styles.hubContainerRight,
        allSectionsFilled && styles.pieAllComplete,
        fillContainer && styles.hubContainerFill,
      )}
      data-right-list-source={
        station === 'right' ? (listSourceFromFacade ?? undefined) : undefined
      }
      style={
        fillContainer
          ? undefined
          : {
              height: `${sizeMiniCard.height}px`,
              width: `${sizeMiniCard.height}px`,
            }
      }
    >
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
                {!hideEmptySectorPlaceholders ? (
                  <IconSectionMenuCardphoto
                    width={PIE_EMPTY_ICON_SIZE}
                    height={PIE_EMPTY_ICON_SIZE}
                  />
                ) : null}
              </g>
            </pattern>

            <pattern
              id={cardtextFillId}
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
                    {!hideEmptySectorPlaceholders ? (
                      <IconSectionMenuCardtext
                        width={PIE_EMPTY_ICON_SIZE}
                        height={PIE_EMPTY_ICON_SIZE}
                      />
                    ) : null}
                  </g>
                  {/* <text x="100" y="600" fill="#064e3b" opacity="0.5">
                  <tspan>Hi...</tspan>
                </text> */}
                </>
              )}
            </pattern>

            <pattern
              id={envelopeFillId}
              patternUnits="userSpaceOnUse"
              width={PIE_ENVELOPE_PATTERN_WIDTH}
              height={PIE_ENVELOPE_PATTERN_HEIGHT}
              x={PATTERN.envelope2560.x}
              y={PATTERN.envelope2560.y}
            >
              {!sections.envelope ? (
                <>
                  <rect
                    width={PIE_ENVELOPE_PATTERN_WIDTH}
                    height={PIE_ENVELOPE_PATTERN_HEIGHT}
                    className={clsx(
                      styles.rect,
                      styles.rectEnvelope,
                      styles.rectEmpty,
                    )}
                  />
                  <g
                    className={styles.pieSectorIconBg}
                    transform={`translate(${PIE_ENVELOPE_EMPTY_ICON_X}, ${PIE_ENVELOPE_EMPTY_ICON_Y}) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                  >
                    {!hideEmptySectorPlaceholders ? (
                      <IconSectionMenuEnvelopeV2
                        width={PIE_EMPTY_ICON_SIZE}
                        height={PIE_EMPTY_ICON_SIZE}
                        x="600"
                        y="-150"
                      />
                    ) : null}
                  </g>
                </>
              ) : hasManyRecipients ? (
                <>
                  <rect
                    width={PIE_ENVELOPE_PATTERN_WIDTH}
                    height={PIE_ENVELOPE_PATTERN_HEIGHT}
                    className={clsx(styles.rect, styles.rectEnvelope)}
                  />
                  {envelopeSenderCircle}
                  {recipientPreviewLines.length > 0 ? (
                    <PieScatteredBackgroundText
                      items={recipientPreviewLines}
                      slots={PIE_ENVELOPE_SCATTER_SLOTS}
                      seed={`env-${recipientPreviewLines.join('\u0000')}`}
                      className={styles.pieEnvelopeIconBg}
                      truncate
                      expand={expandEnvelopeRecipientsForBg}
                    />
                  ) : null}
                  <text
                    x={PIE_ENVELOPE_PATTERN_WIDTH / 2}
                    y="2150"
                    textAnchor="middle"
                    strokeLinejoin="round"
                    fill="var(--envelope-text)"
                  >
                    <tspan
                      x={PIE_ENVELOPE_PATTERN_WIDTH / 2}
                      dy="250"
                      dx="550"
                      fontWeight="700"
                      fontSize="1500"
                    >
                      {recipientCount}
                    </tspan>
                  </text>
                </>
              ) : recipient ? (
                <>
                  <rect
                    width={PIE_ENVELOPE_PATTERN_WIDTH}
                    height={PIE_ENVELOPE_PATTERN_HEIGHT}
                    className={clsx(styles.rect, styles.rectEnvelope)}
                  />
                  <circle
                    cx={PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT.cx}
                    cy={PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT.cy}
                    r={PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT.outerRadius}
                    className={styles.pieEnvelopeSingleCircleOuter}
                  />
                  <circle
                    cx={PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT.cx}
                    cy={PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT.cy}
                    r={PIE_ENVELOPE_SINGLE_CIRCLE_LAYOUT.innerRadius}
                    className={styles.pieEnvelopeSingleCircleInner}
                  />
                  {envelopeSenderCircle}
                  <text
                    x={PIE_ENVELOPE_PATTERN_WIDTH / 2}
                    y="1700"
                    textAnchor="middle"
                    strokeLinejoin="round"
                    fill="var(--envelope-text)"
                  >
                    <tspan
                      // x={PIE_ENVELOPE_PATTERN_WIDTH / 2}
                      x="1800"
                      dy="0"
                      fontWeight="600"
                      fontSize="650"
                    >
                      {recipient.name}
                    </tspan>
                    <tspan x="1800" dy="750" fontWeight="600" fontSize="400">
                      {recipient.country ?? recipient.city}
                    </tspan>
                  </text>
                </>
              ) : (
                <>
                  <rect
                    width={PIE_ENVELOPE_PATTERN_WIDTH}
                    height={PIE_ENVELOPE_PATTERN_HEIGHT}
                    className={clsx(
                      styles.rect,
                      styles.rectEnvelope,
                      styles.rectEmpty,
                    )}
                  />
                  {envelopeSenderCircle}
                  {!hideEmptySectorPlaceholders ? (
                    <g
                      className={styles.pieSectorIconBg}
                      transform={`translate(${PIE_ENVELOPE_EMPTY_ICON_X}, ${PIE_ENVELOPE_EMPTY_ICON_Y}) translate(-${PIE_EMPTY_ICON_HALF}, -${PIE_EMPTY_ICON_HALF})`}
                    >
                      <IconSectionMenuEnvelopeV2
                        width={PIE_EMPTY_ICON_SIZE}
                        height={PIE_EMPTY_ICON_SIZE}
                      />
                    </g>
                  ) : null}
                </>
              )}
            </pattern>

            <pattern
              id={aromaFillId}
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
                    {!hideEmptySectorPlaceholders ? (
                      <IconSectionMenuAromaV2
                        width={PIE_EMPTY_ICON_SIZE}
                        height={PIE_EMPTY_ICON_SIZE}
                      />
                    ) : null}
                  </g>
                </>
              )}
            </pattern>

            <pattern
              id={dateFillId}
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
                  {datePreviewLines.length > 0 ? (
                    <PieScatteredBackgroundText
                      items={datePreviewLines}
                      slots={PIE_DATE_SCATTER_SLOTS}
                      seed={`date-${datePreviewLines.join('\u0000')}`}
                      className={styles.pieDateIconBg}
                    />
                  ) : null}
                  <text
                    x="2560"
                    y="3200"
                    textAnchor="middle"
                    strokeLinejoin="round"
                    className={clsx(
                      styles.pieTextBase,
                      styles.pieTextDate,
                      isCartDateDisabled && styles.pieTextDateDisabled,
                    )}
                  >
                    <tspan x="2000" dy="-100" fontWeight="700" fontSize="1500">
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
                    className={clsx(
                      styles.pieTextBase,
                      styles.pieTextDate,
                      isCartDateDisabled && styles.pieTextDateDisabled,
                    )}
                  >
                    <tspan x="2000" dy="-200" fontWeight="400" fontSize="550">
                      {date.year}
                    </tspan>
                    <tspan x="2000" dy="1250" fontWeight="600" fontSize="1400">
                      {date.day}
                    </tspan>
                    <tspan x="2000" dy="700" fontSize="550">
                      {MONTH_NAMES[date.month]}
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
                    {!hideEmptySectorPlaceholders ? (
                      <IconSectionMenuDate
                        width={PIE_EMPTY_ICON_SIZE}
                        height={PIE_EMPTY_ICON_SIZE}
                        x="-550"
                      />
                    ) : null}
                  </g>
                </>
              )}
            </pattern>
          </defs>

          <g id={`${pieDefsUid}-pie-layers`}>
            <path
              id={`${pieDefsUid}-sector-aroma`}
              data-section="aroma"
              className={clsx(
                styles.sector,
                !sections.aroma && styles.sectorEmpty,
                hoveredSection === 'aroma' && styles.hovered,
              )}
              fill={`url(#${aromaFillId})`}
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M5110 5110H1261l1299-2550z"
              onClick={() => handleSectorClick('aroma')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <path
              id={`${pieDefsUid}-sector-date`}
              data-section="date"
              className={clsx(
                styles.sector,
                !sections.date && styles.sectorEmpty,
                hoveredSection === 'date' && styles.hovered,
              )}
              fill={`url(#${dateFillId})`}
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M1261 5110H10V2156l2550 404z"
              onClick={() => handleSectorClick('date')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <path
              id={`${pieDefsUid}-sector-envelope`}
              data-section="envelope"
              className={clsx(
                styles.sector,
                !sections.envelope && styles.sectorEmpty,
                hoveredSection === 'envelope' && styles.hovered,
              )}
              fill={`url(#${envelopeFillId})`}
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d={PIE_ENVELOPE_SECTOR_D}
              onClick={() => handleSectorClick('envelope')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <path
              id={`${pieDefsUid}-sector-cardphoto`}
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
              id={`${pieDefsUid}-sector-cardtext`}
              data-section="cardtext"
              className={clsx(
                styles.sector,
                !sections.cardtext && styles.sectorEmpty,
                hoveredSection === 'cardtext' && styles.hovered,
              )}
              fill={`url(#${cardtextFillId})`}
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
            {/* <path
              id="cardphoto-bg"
              className={styles.sectorBg}
              fill="none"
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M542 541h1350v1350H542z"
            /> */}
            {/* <path
              id="envelope-bg"
              className={styles.sectorBg}
              fill="none"
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M3725 2182h1350v1350H3725z"
            /> */}
            {/* <path
              id="date-bg"
              className={styles.sectorBg}
              fill="none"
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M192 2748h1350v1350H192z"
            /> */}
            {/* <path
              id="cardtext-bg"
              className={styles.sectorBg}
              fill="none"
              stroke={SECTOR_STROKE}
              strokeWidth={STROKE_WIDTH}
              d="M2748 192h1350v1350H2748z"
            /> */}
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
      {!(station === 'left' && hideLeftPieCenterLogo) ? (
        <button
          type="button"
          className={clsx(
            styles.pieCenterButton,
            allSectionsFilled && styles.pieCenterButtonActive,
            station === 'left' &&
              leftPieCenterClickable &&
              styles.pieCenterButtonPointer,
            station === 'right' &&
              onRightPieCenterClick != null &&
              styles.pieCenterButtonPointer,
          )}
          disabled={
            station === 'left'
              ? !leftPieCenterClickable
              : onRightPieCenterClick != null
                ? false
                : !allSectionsFilled
          }
          aria-label="Hidragonfly.com"
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          onClick={() => {
            if (station === 'left' && leftPieCenterClickable) {
              onLeftPieCenterClick?.()
              return
            }
            if (station === 'right') {
              onRightPieCenterClick?.()
            }
          }}
        >
          <span
            className={clsx(
              styles.pieCenterIcon,
              allSectionsFilled && styles.pieCenterIconBrand,
            )}
          >
            {station === 'left' ? (
              <IconLogo aria-hidden />
            ) : (
              <span
                className={clsx(
                  styles.pieCenterIndicator,
                  styles[status ?? ''],
                )}
              ></span>
            )}
          </span>
        </button>
      ) : null}
    </div>
  )
}
