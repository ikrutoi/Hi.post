import React from 'react'
import clsx from 'clsx'
import { AROMA_IMAGES } from '@entities/aroma/domain/types'
import listOfMonthOfYear from '@data/date/monthOfYear.json'
import { useCardFacade } from '@entities/card/application/facades'
import styles from './CardPie.module.scss'

export const CardPie: React.FC = () => {
  const { activeSection, previewCard, openSection } = useCardFacade()

  const photoUrl = previewCard?.cardphoto?.base?.apply?.image?.url
  const aromaIndex = previewCard?.aroma.index
  const aromaImageUrl = aromaIndex ? AROMA_IMAGES[aromaIndex] : null
  const recipient = previewCard?.envelope.recipient.data
  const date = previewCard?.date
  if (previewCard) {
    console.log('CardPie', listOfMonthOfYear[previewCard.date.month])
  }

  return (
    <div className={styles.hubContainer}>
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
              <rect width="2560" height="2560" fill="#e0e0e0" />
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
                <image
                  href={aromaImageUrl}
                  width="2000"
                  height="2000"
                  x="256"
                  y="256"
                  preserveAspectRatio="xMidYMid meet"
                />
              </>
            ) : (
              <rect width="2560" height="2560" fill="#9b59b6" opacity="0.3" />
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
            {recipient && (
              <>
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
            {date && (
              <>
                <rect
                  width="2560"
                  height="3135"
                  fill="hsl(207, 70%, 47%)"
                  opacity="1"
                ></rect>
                <text
                  x="1280"
                  y="750"
                  textAnchor="middle"
                  // stroke="white"
                  // strokeWidth="5"
                  strokeLinejoin="round"
                  fill="white"
                  // className={styles.pieDateContainer}
                >
                  <tspan x="1280" dy="0" fontWeight="400" fontSize="550">
                    {date.year}
                  </tspan>

                  <tspan x="1280" dy="1100" fontWeight="600" fontSize="1200">
                    {date.day}
                  </tspan>

                  <tspan x="1280" dy="600" fontSize="550">
                    {listOfMonthOfYear[date.month]}
                  </tspan>
                </text>
              </>
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
              activeSection === 'cardphoto' && styles.active,
            )}
            onClick={() => openSection('cardphoto')}
          />

          <path
            id="cardtext"
            d="m896 5120 1664-2560L0 1985v2371c0 420 344 764 764 764z"
            fill={previewCard?.cardtext ? '#ffca28' : '#eee'}
            className={clsx(
              styles.sector,
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
              activeSection === 'date' && styles.active,
            )}
            onClick={() => openSection('date')}
          />
        </g>
      </svg>
    </div>
  )
}
