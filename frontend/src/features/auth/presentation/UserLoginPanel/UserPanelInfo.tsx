import React, { useRef, useState } from 'react'
import infoMain01 from '@shared/assets/info/info_main_01.jpg'
import infoMain02 from '@shared/assets/info/info_main_02.jpg'
import infoMain03 from '@shared/assets/info/info_main_03.jpg'
import infoMain04 from '@shared/assets/info/info_main_04.jpg'
import infoMain05 from '@shared/assets/info/info_main_05.jpg'
import infoMain06 from '@shared/assets/info/info_main_06.jpg'
import info203 from '@shared/assets/info/info_2_03.jpg'
import info204 from '@shared/assets/info/info_2_04.jpg'
import info205 from '@shared/assets/info/info_2_05.jpg'
import info206 from '@shared/assets/info/info_2_06.jpg'
import styles from './UserLoginPanel.module.scss'

type InfoCell = { id: string; src: string }

const INFO_PAGES: ReadonlyArray<ReadonlyArray<InfoCell>> = [
  [
    { id: '01', src: infoMain01 },
    { id: '02', src: infoMain02 },
    { id: '03', src: infoMain03 },
    { id: '04', src: infoMain04 },
    { id: '05', src: infoMain05 },
    { id: '06', src: infoMain06 },
  ],
  [
    { id: '11', src: infoMain01 },
    { id: '12', src: infoMain02 },
    { id: '13', src: info203 },
    { id: '14', src: info204 },
    { id: '15', src: info205 },
    { id: '16', src: info206 },
  ],
]

const SWIPE_MIN_PX = 48

export const UserPanelInfo: React.FC = () => {
  const [page, setPage] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const lastPage = INFO_PAGES.length - 1

  const goTo = (next: number) => {
    setPage(Math.min(lastPage, Math.max(0, next)))
  }

  return (
    <div className={styles.infoPager}>
      <div
        className={styles.infoViewport}
        onTouchStart={(event) => {
          const touch = event.changedTouches[0]
          if (touch == null) return
          touchStart.current = { x: touch.clientX, y: touch.clientY }
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current
          touchStart.current = null
          const touch = event.changedTouches[0]
          if (start == null || touch == null) return
          const dx = touch.clientX - start.x
          const dy = touch.clientY - start.y
          if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return
          goTo(page + (dx < 0 ? 1 : -1))
        }}
        onTouchCancel={() => {
          touchStart.current = null
        }}
      >
        <div
          className={styles.infoTrack}
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {INFO_PAGES.map((cells, pageIndex) => (
            <div
              key={pageIndex}
              className={styles.infoPage}
              role="list"
              aria-label={pageIndex === 0 ? 'Info' : 'Info, price'}
              aria-hidden={pageIndex === page ? undefined : true}
            >
              {cells.map((cell) => (
                <div key={cell.id} className={styles.infoCell} role="listitem">
                  <img className={styles.infoCellImage} src={cell.src} alt="" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoDots}>
        {INFO_PAGES.map((_, index) => (
          <button
            key={index}
            type="button"
            className={styles.infoDot}
            data-active={index === page ? 'true' : undefined}
            aria-label={index === 0 ? 'First info page' : 'Second info page'}
            aria-current={index === page ? 'true' : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <div className={styles.infoNav}>
        <button
          type="button"
          className={styles.infoNavButton}
          aria-label="Previous info page"
          disabled={page === 0}
          onClick={() => goTo(page - 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M14.5 5.5 8 12l6.5 6.5" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.infoNavButton}
          aria-label="Next info page"
          disabled={page === lastPage}
          onClick={() => goTo(page + 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M9.5 5.5 16 12l-6.5 6.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}
