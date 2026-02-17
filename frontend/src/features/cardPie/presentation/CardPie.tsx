import React from 'react'
import clsx from 'clsx'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import listOfMonthOfYear from '@data/date/monthOfYear.json'
import { useSizeFacade } from '@layout/application/facades'
import { useCardFacade } from '@entities/card/application/facades'
import { useCardtextFacade } from '@cardtext/application/facades'
import styles from './CardPie.module.scss'
import { CardPieProps } from '../domain/types'
import { useCardPieFacade } from '../application/facade'
import { useSectionMenuFacade } from '@/entities/sectionEditorMenu/application/facades'
import { CardPieStatus } from './CardPieStatus'
import { useCardEditorFacade } from '@/entities/cardEditor/application/facades'
import { CardSection } from '@shared/config/constants'

export const CardPie: React.FC<CardPieProps> = ({ status, id }) => {
  const {
    data,
    sections,
    isRainbowActive,
    isRainbowStopping,
    onIteration,
    handleSectorClick,
  } = useCardPieFacade(status, id)
  // const { data, isReady } = useCardPieFacade(status, id)
  const { activeSection, previewCard, openSection } = useCardFacade()
  const { sizeMiniCard } = useSizeFacade()
  const { setHovered, hoveredSection, isSectionHovered } = useCardEditorFacade()
  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    const sectionId = e.currentTarget.id as CardSection
    setHovered(sectionId)
  }

  const handleMouseLeave = () => setHovered(null)

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
  const date = cardData?.date

  return (
    <div
      className={styles.hubContainer}
      style={{
        height: `${sizeMiniCard.height}px`,
        width: `${sizeMiniCard.height}px`,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5120 5120"
        className={styles.svg}
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
                style={{}}
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
            {previewLines ? (
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
                  {previewLines.length > 0 ? (
                    previewLines.map((line, i) => {
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
                    })
                  ) : (
                    <tspan x="100" dy="0">
                      ...
                    </tspan>
                  )}
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
            {recipient ? (
              <>
                <rect
                  width="2560"
                  height="2560"
                  className={clsx(styles.rect, styles.rectEnvelope)}
                ></rect>
                <text
                  x="1280"
                  y="1050"
                  textAnchor="middle"
                  strokeLinejoin="round"
                  fill="hsl(207, 95%, 29%)"
                >
                  <tspan x="1280" dy="0" fontWeight="400" fontSize="550">
                    {recipient.name}
                  </tspan>

                  <tspan x="1280" dy="750" fontWeight="400" fontSize="450">
                    {recipient.city}
                  </tspan>
                </text>
              </>
            ) : (
              <rect
                width="2560"
                height="2560"
                className={clsx(styles.rect, styles.rectEnvelope)}
              ></rect>
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
                ></rect>
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
                ></rect>
                <text
                  x="1280"
                  y="750"
                  textAnchor="middle"
                  // stroke="white"
                  // strokeWidth="5"
                  strokeLinejoin="round"
                  fill="hsl(207, 70%, 47%)"
                  // className={styles.pieDateContainer}
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
              ></rect>
            )}
          </pattern>
        </defs>
        <defs>
          <linearGradient id="grad-cardphoto" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#a0af49" />
            <stop offset="15%" stop-color="#4caf50" />
            <stop offset="85%" stop-color="#4caf50" />
            <stop offset="100%" stop-color="#479a9a" />
          </linearGradient>

          <linearGradient id="grad-cardtext" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e78a59" />
            <stop offset="20%" stop-color="#f4af42" />
            <stop offset="85%" stop-color="#f4af42" />
            <stop offset="100%" stop-color="#a0af49" />
          </linearGradient>

          <linearGradient
            id="grad-envelope"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stop-color="#e78a59" />
            <stop offset="20%" stop-color="#d96570" />
            <stop offset="80%" stop-color="#d96570" />
            <stop offset="100%" stop-color="#ba6c9e" />
          </linearGradient>

          <linearGradient id="grad-aroma" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ba6c9e" />
            <stop offset="20%" stop-color="#9b72cb" />
            <stop offset="80%" stop-color="#9b72cb" />
            <stop offset="100%" stop-color="#6f7ccf" />
          </linearGradient>

          <linearGradient id="grad-date" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#479a9a" />
            <stop offset="15%" stop-color="#4285f4" />
            <stop offset="80%" stop-color="#4285f4" />
            <stop offset="100%" stop-color="#6f7ccf" />
          </linearGradient>
        </defs>

        {isRainbowActive ? (
          <g>
            <defs>
              <clipPath id="ring-mask">
                <path d="M876 4960c-394 0-716-322-716-716V876c0-394 322-716 716-716h3368c394 0 716 322 716 716v3368c0 502-392 716-840 716zm-112 160c-420 0-764-344-764-764V764C0 344 344 0 764 0h3592c420 0 764 344 764 764v3592c0 420-344 764-764 764z" />
              </clipPath>
            </defs>

            <foreignObject
              x="0"
              y="0"
              width="5120"
              height="5120"
              clipPath="url(#ring-mask)"
            >
              <div className={styles.rainbowRotationWrapper}>
                <div
                  className={clsx(
                    styles.conicGradient,
                    isRainbowActive && !isRainbowStopping && styles.rotating,
                    isRainbowStopping && styles.stopping,
                  )}
                  onAnimationIteration={onIteration}
                  onAnimationEnd={onIteration}
                />
              </div>
            </foreignObject>
          </g>
        ) : (
          <g>
            <path
              id="aroma-bg"
              d="M2560 160V0h1796c420 0 764 344 764 764v1257h-160V876c0-394-322-716-716-716z"
              className={clsx(
                styles.sectorBg,
                sections.aroma ? styles.bgAroma : styles.bgInactive,
              )}
              onClick={() => handleSectorClick('aroma')}
            />

            <path
              id="envelope-bg"
              d="M2560 160V0H764C344 0 0 344 0 764v1257h160V876c0-394 322-716 716-716z"
              className={clsx(
                styles.sectorBg,
                sections.envelope ? styles.bgEnvelope : styles.bgInactive,
              )}
              onClick={() => handleSectorClick('envelope')}
            />

            <path
              id="cardtext-bg"
              d="M1000 4960v160H764c-420 0-764-344-764-764V2021h160v2223c0 394 322 716 716 716z"
              className={clsx(
                styles.sectorBg,
                sections.cardtext ? styles.bgCardtext : styles.bgInactive,
              )}
              onClick={() => handleSectorClick('cardtext')}
            />

            <path
              id="date-bg"
              d="M4120 4960v160h236c420 0 764-344 764-764V2021h-160v2223c0 394-322 716-716 716z"
              className={clsx(
                styles.sectorBg,
                sections.date ? styles.bgDate : styles.bgInactive,
              )}
              onClick={() => handleSectorClick('date')}
            />

            <path
              id="cardphoto-bg"
              d="M1000 4960h3119v160H1000z"
              className={clsx(
                styles.sectorBg,
                sections.cardphoto ? styles.bgCardphoto : styles.bgInactive,
              )}
              onClick={() => handleSectorClick('cardphoto')}
            />
          </g>
        )}

        <g id="HubGroups">
          <path
            id="cardphoto"
            d="m2560 2560 1560 2400H1000z"
            fill="url(#photo-fill)"
            className={clsx(
              styles.sector,
              styles.sectorCardphoto,
              activeSection === 'cardphoto' && styles.active,
              isSectionHovered('cardphoto') && styles.hovered,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openSection('cardphoto')}
          />

          <path
            id="cardtext"
            d="m1000 4960 1560-2400-2400-539v2223c0 394 322 716 716 716z"
            fill="url(#cardtext-fill)"
            className={clsx(
              styles.sector,
              styles.sectorCardtext,
              activeSection === 'cardtext' && styles.active,
              isSectionHovered('cardtext') && styles.hovered,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openSection('cardtext')}
          />

          <path
            id="envelope"
            d="M2560 160H876c-394 0-716 322-716 716v1145l2400 539z"
            fill="url(#envelope-fill)"
            className={clsx(
              styles.sector,
              styles.sectorEnvelope,
              activeSection === 'envelope' && styles.active,
              isSectionHovered('envelope') && styles.hovered,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openSection('envelope')}
          />

          <path
            id="aroma"
            d="M4960 2021V876c0-394-322-716-716-716H2560v2400z"
            fill="url(#aroma-fill)"
            className={clsx(
              styles.sector,
              styles.sectorAroma,
              activeSection === 'aroma' && styles.active,
              isSectionHovered('aroma') && styles.hovered,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openSection('aroma')}
          />

          <path
            id="date"
            d="m4960 2021-2400 539 1560 2400h124c394 0 716-322 716-716z"
            fill="url(#date-fill)"
            className={clsx(
              styles.sector,
              styles.sectorDate,
              activeSection === 'date' && styles.active,
              isSectionHovered('date') && styles.hovered,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openSection('date')}
          />
        </g>
      </svg>
      <CardPieStatus
        isRainbowActive={isRainbowActive}
        isRainbowStopping={isRainbowStopping}
      />
    </div>
  )
}
