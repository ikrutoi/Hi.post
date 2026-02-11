import React from 'react'
import clsx from 'clsx'
import { useCardFacade } from '@entities/card/application/facades'
import styles from './CardPie.module.scss'

export const CardPie: React.FC = () => {
  const { activeSection, previewCard, openSection } = useCardFacade()

  const photoUrl = previewCard?.cardphoto?.base?.apply?.image?.url
  const isDateSet = !!previewCard?.date

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
              <rect width="5120" height="5120" fill="#e0e0e0" />
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
            fill="#2ecc71"
            className={clsx(
              styles.sector,
              activeSection === 'envelope' && styles.active,
            )}
            onClick={() => openSection('envelope')}
          />

          <path
            id="aroma"
            d="M5120 1985V764c0-420-344-764-764-764H2560v2560z"
            fill="#9b59b6"
            className={clsx(
              styles.sector,
              activeSection === 'aroma' && styles.active,
            )}
            onClick={() => openSection('aroma')}
          />

          <path
            id="date"
            d="m5120 1985-2560 575 1664 2560h132c420 0 764-344 764-764z"
            fill={isDateSet ? '#3498db' : '#f1f5f9'}
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
