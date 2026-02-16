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

// export const CardPie: React.FC<CardPieProps> = () => {
//   const { activeSection, previewCard, openSection } = useCardFacade()
//   const { value } = useCardtextFacade()
//   const { sizeMiniCard } = useSizeFacade()

//   const previewLines = value
//     .slice(0, 6)
//     .map((block) => {
//       const fullLineText = block.children.map((child) => child.text).join('')
//       return fullLineText.split(/\s+/).filter(Boolean).slice(0, 4).join(' ')
//     })
//     .filter((line) => line.length > 0)

//   const photoUrl = previewCard?.cardphoto?.base?.apply?.image?.url
//   const aromaIndex = previewCard?.aroma.index
//   const aromaImageUrl = aromaIndex ? AROMA_IMAGES[aromaIndex] : null
//   const recipient = previewCard?.envelope.recipient.data
//   const date = previewCard?.date
//   const text = previewCard?.cardtext.value

export const CardPie: React.FC<CardPieProps> = ({ status, id }) => {
  const { data, isReady } = useCardPieFacade(status, id)
  const { activeSection, previewCard, openSection } = useCardFacade()
  // const { activeSection, openSection } = useSectionMenuFacade()
  const { sizeMiniCard } = useSizeFacade()

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
  // const photoUrl = cardData?.cardphoto?.appliedImage?.url
  const aromaIndex = cardData?.aroma?.index
  const aromaImageUrl = aromaIndex ? AROMA_IMAGES[aromaIndex] : null
  const recipient = cardData?.recipient ? cardData?.recipient : null
  // const recipient = cardData?.envelope?.recipient?.data
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
                className={clsx(styles.rectCardphoto)}
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
                  className={clsx(styles.rectCardtext)}
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
                  className={clsx(styles.rectCardtext)}
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
                  className={clsx(styles.rectEnvelope)}
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
                className={clsx(styles.rectEnvelope)}
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
                  className={clsx(styles.rectAroma)}
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
                className={clsx(styles.rectAroma)}
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
                  className={clsx(styles.rectDate)}
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
                className={clsx(styles.rectDate)}
              ></rect>
            )}
          </pattern>
        </defs>

        <g id="HubGroups">
          <path
            id="cardphoto"
            d="m2560 2560 1664 2560H896z"
            fill="url(#photo-fill)"
            className={clsx(
              styles.sector,
              styles.sectorCardphoto,
              activeSection === 'cardphoto' && styles.active,
            )}
            onClick={() => openSection('cardphoto')}
          />

          <path
            id="cardtext"
            d="m896 5120 1664-2560L0 1985v2371c0 420 344 764 764 764z"
            fill="url(#cardtext-fill)"
            className={clsx(
              styles.sector,
              styles.sectorCardtext,
              activeSection === 'cardtext' && styles.active,
            )}
            onClick={() => openSection('cardtext')}
          />

          <path
            id="envelope"
            d="M2560 0H764C344 0 0 344 0 764v1221l2560 575z"
            fill="url(#envelope-fill)"
            className={clsx(
              styles.sector,
              styles.sectorEnvelope,
              activeSection === 'envelope' && styles.active,
            )}
            onClick={() => openSection('envelope')}
          />

          <path
            id="aroma"
            d="M5120 1985V764c0-420-344-764-764-764H2560v2560z"
            fill="url(#aroma-fill)"
            className={clsx(
              styles.sector,
              styles.sectorAroma,
              activeSection === 'aroma' && styles.active,
            )}
            onClick={() => openSection('aroma')}
          />

          <path
            id="date"
            d="m5120 1985-2560 575 1664 2560h132c420 0 764-344 764-764z"
            fill="url(#date-fill)"
            className={clsx(
              styles.sector,
              styles.sectorDate,
              activeSection === 'date' && styles.active,
            )}
            onClick={() => openSection('date')}
          />
        </g>
      </svg>
      <div
        className={clsx(
          styles.sectorIndicator,
          // activeSection === 'date' && styles.active,
        )}
      ></div>
    </div>
  )
}
