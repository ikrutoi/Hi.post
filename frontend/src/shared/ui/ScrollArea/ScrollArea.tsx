import React, { useEffect, useRef, useState, useCallback } from 'react'
import clsx from 'clsx'
import styles from './ScrollArea.module.scss'

type ScrollAreaProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className,
  contentClassName,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)

  const updateThumb = useCallback(() => {
    const el = contentRef.current
    const track = trackRef.current
    if (!el || !track) return

    const { scrollHeight, clientHeight, scrollTop } = el
    if (scrollHeight <= clientHeight || clientHeight === 0) {
      setThumbHeight(0)
      setThumbTop(0)
      return
    }

    const trackHeight = track.clientHeight
    if (trackHeight === 0) {
      setThumbHeight(0)
      setThumbTop(0)
      return
    }

    const height = Math.max(
      20,
      (clientHeight / scrollHeight) * trackHeight,
    )
    const maxTop = trackHeight - height
    const top =
      maxTop <= 0
        ? 0
        : (scrollTop / (scrollHeight - clientHeight)) * maxTop

    setThumbHeight(height)
    setThumbTop(top)
  }, [])

  useEffect(() => {
    updateThumb()
  }, [updateThumb, children])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const handleScroll = () => {
      updateThumb()
    }

    el.addEventListener('scroll', handleScroll)

    const handleResize = () => {
      updateThumb()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateThumb])

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = contentRef.current
    const track = trackRef.current
    if (!el || !track) return

    const startY = e.clientY
    const startTop = thumbTop
    const trackRect = track.getBoundingClientRect()
    const trackHeight = trackRect.height
    const { scrollHeight, clientHeight } = el
    const maxTop = trackHeight - thumbHeight
    const maxScroll = scrollHeight - clientHeight

    const handleMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY
      const nextTopRaw = startTop + delta
      const nextTop =
        maxTop <= 0
          ? 0
          : Math.min(Math.max(0, nextTopRaw), maxTop)
      const ratio = maxTop > 0 ? nextTop / maxTop : 0
      el.scrollTop = ratio * maxScroll
      updateThumb()
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const showThumb = thumbHeight > 0

  return (
    <div className={clsx(styles.scrollArea, className)}>
      <div
        ref={contentRef}
        className={clsx(styles.scrollAreaContent, contentClassName)}
      >
        {children}
      </div>
      <div ref={trackRef} className={styles.scrollbarTrack}>
        <div
          className={clsx(
            styles.scrollbarThumb,
            !showThumb && styles.scrollbarHidden,
          )}
          style={{
            height: thumbHeight,
            top: thumbTop,
          }}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </div>
  )
}

