import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@app/hooks'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import {
  AROMA_IMAGES_THUMB,
  type AromaSlot,
} from '@entities/aroma/domain/types'
import { selectListArchiveCardPieBundle } from '@features/cardPie/infrastructure/selectors/cardPieSelectors'
import type { CardPieRightListSource } from '@features/cardPie/domain/types'

/** Минимальная пауза после смены открытки — без хаотичного «догрузки» секторов. */
export const MOBILE_CENTRAL_ARCHIVE_PIE_MIN_HOLD_MS = 200

/** Длительность fade out / fade in центрального archive CardPie. */
export const MOBILE_CENTRAL_ARCHIVE_PIE_FADE_MS = 180

export type MobileCentralArchivePieGateResult = {
  /**
   * Сейчас в DOM нет CardPie (белый blank между fade out и fade in).
   * Не путать с «нет выбора» — выбор может уже быть, контент ещё не смонтирован.
   */
  shouldHoldEmpty: boolean
  /** Целевая открытка собрана (bundle + media + minHold). */
  isPaintReady: boolean
  /** Ключ / id смонтированного CardPie (может ещё быть предыдущая во время fade out). */
  revealToken: string | null
  mountedLocalId: number | null
  mountedSource: CardPieRightListSource | null
  /** Opacity слоя: false → fade out, true → fade in. */
  contentOpaque: boolean
  fadeMs: number
}

type MountedArchivePie = {
  id: string
  source: CardPieRightListSource
}

let aromaImagesWarmStarted = false

/** Прогрев всех слотов аромы в HTTP/image cache браузера (один раз за сессию). */
function warmAromaImages(): void {
  if (aromaImagesWarmStarted) return
  aromaImagesWarmStarted = true
  for (const url of Object.values(AROMA_IMAGES_THUMB)) {
    if (!url) continue
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}

function preloadDecodedImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    img.onload = finish
    img.onerror = finish
    img.decoding = 'async'
    img.src = url
    if (typeof img.decode === 'function') {
      void img.decode().then(finish).catch(finish)
    }
  })
}

/**
 * Гейт отрисовки центрального archive CardPie при переключении открыток.
 * Следующая открытка сменяет текущую сразу, без белого кадра между ними.
 * Уход в пустой архив гасит pie и возвращает placeholder.
 */
export function useMobileCentralArchivePieGate(
  localId: number | null,
  source: CardPieRightListSource | null,
  options?: { minHoldMs?: number; fadeMs?: number },
): MobileCentralArchivePieGateResult {
  const minHoldMs = options?.minHoldMs ?? MOBILE_CENTRAL_ARCHIVE_PIE_MIN_HOLD_MS
  const fadeMs = options?.fadeMs ?? MOBILE_CENTRAL_ARCHIVE_PIE_FADE_MS
  const idStr = localId != null ? String(localId) : ''

  useEffect(() => {
    warmAromaImages()
  }, [])

  const bundle = useAppSelector((state) =>
    idStr !== ''
      ? selectListArchiveCardPieBundle(state, idStr, source)
      : null,
  )

  const cardphoto = bundle?.currentData.data.cardphoto
  const needsPhoto = Boolean(
    bundle?.sections.cardphoto &&
      (cardphoto?.factoryDisplayUrl?.trim() || cardphoto?.previewUrl?.trim()),
  )
  const photoCardId = needsPhoto ? cardphoto?.id : undefined
  const photoPreviewUrl = needsPhoto
    ? (cardphoto?.factoryDisplayUrl ?? cardphoto?.previewUrl ?? null)
    : null

  const { displayUrl } = useListCardPreviewUrl(photoCardId, photoPreviewUrl)

  const aromaIndex = bundle?.currentData.data.aroma?.index
  const needsAroma = Boolean(bundle?.sections.aroma && aromaIndex != null)
  const aromaUrl =
    needsAroma && aromaIndex != null
      ? (AROMA_IMAGES_THUMB[aromaIndex as AromaSlot] ?? null)
      : null

  const [minHoldElapsed, setMinHoldElapsed] = useState(localId == null)
  const [mediaDecoded, setMediaDecoded] = useState(true)
  const [paintWaitTimedOut, setPaintWaitTimedOut] = useState(false)
  const [mounted, setMounted] = useState<MountedArchivePie | null>(null)
  const [contentOpaque, setContentOpaque] = useState(false)
  const [fadeOutDone, setFadeOutDone] = useState(true)
  const mountedRef = useRef(mounted)
  mountedRef.current = mounted

  useEffect(() => {
    if (localId == null) {
      setMinHoldElapsed(true)
      setPaintWaitTimedOut(false)
      return
    }
    setMinHoldElapsed(false)
    setPaintWaitTimedOut(false)
    const timerId = window.setTimeout(() => {
      setMinHoldElapsed(true)
    }, minHoldMs)
    const failOpenId = window.setTimeout(() => {
      setPaintWaitTimedOut(true)
      setMinHoldElapsed(true)
      setMediaDecoded(true)
    }, Math.max(minHoldMs, 500))
    return () => {
      window.clearTimeout(timerId)
      window.clearTimeout(failOpenId)
    }
  }, [localId, minHoldMs])

  useEffect(() => {
    if (localId == null) {
      setMediaDecoded(true)
      return
    }

    const urls: string[] = []
    if (needsPhoto) {
      if (displayUrl == null || displayUrl.trim() === '') {
        setMediaDecoded(false)
        return
      }
      urls.push(displayUrl)
    }
    if (needsAroma) {
      if (aromaUrl == null || aromaUrl.trim() === '') {
        setMediaDecoded(false)
        return
      }
      urls.push(aromaUrl)
    }

    if (urls.length === 0) {
      setMediaDecoded(true)
      return
    }

    let cancelled = false
    setMediaDecoded(false)
    void Promise.all(urls.map(preloadDecodedImage)).then(() => {
      if (!cancelled) setMediaDecoded(true)
    })

    return () => {
      cancelled = true
    }
  }, [localId, needsPhoto, displayUrl, needsAroma, aromaUrl])

  /** Уход с открытки: fade out. Смена цели не снимает текущий pie в белый кадр. */
  useEffect(() => {
    if (localId != null) {
      setFadeOutDone(true)
      return
    }

    setContentOpaque(false)
    if (mountedRef.current == null) {
      setMounted(null)
      setFadeOutDone(true)
      return
    }

    setFadeOutDone(false)
    const timerId = window.setTimeout(() => {
      setMounted(null)
      setFadeOutDone(true)
    }, fadeMs)
    return () => {
      window.clearTimeout(timerId)
    }
  }, [localId, fadeMs])

  const isContentReady =
    localId != null &&
    bundle != null &&
    mediaDecoded &&
    (!needsPhoto || Boolean(displayUrl?.trim())) &&
    (!needsAroma || Boolean(aromaUrl?.trim()))
  const isPaintReady = Boolean(
    (isContentReady && minHoldElapsed) ||
      (localId != null && bundle != null && paintWaitTimedOut),
  )

  /** Когда цель готова — сразу её pie, без белого кадра между fade out и fade in. */
  useEffect(() => {
    if (localId == null || source == null) return
    if (!fadeOutDone || !isPaintReady) return

    const current = mountedRef.current
    if (current?.id === idStr) {
      if (!contentOpaque) setContentOpaque(true)
      return
    }

    setMounted({ id: idStr, source })
    setContentOpaque(true)
  }, [localId, source, idStr, fadeOutDone, isPaintReady, contentOpaque])

  if (localId == null && mounted == null) {
    return {
      shouldHoldEmpty: false,
      isPaintReady: false,
      revealToken: null,
      mountedLocalId: null,
      mountedSource: null,
      contentOpaque: false,
      fadeMs,
    }
  }

  return {
    shouldHoldEmpty: mounted == null,
    isPaintReady,
    revealToken: mounted?.id ?? null,
    mountedLocalId: mounted != null ? Number(mounted.id) : null,
    mountedSource: mounted?.source ?? null,
    contentOpaque,
    fadeMs,
  }
}
