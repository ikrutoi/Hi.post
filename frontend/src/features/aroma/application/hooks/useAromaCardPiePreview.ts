import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectViewAroma } from '@aroma/infrastructure/selectors'
import { getAromaImage } from '@entities/aroma/mappers/aromaImageMap'
import {
  useMobileAromaPreviewGate,
  type MobileAromaPreviewGateResult,
  type MobileAromaPreviewTarget,
} from './useMobileAromaPreviewGate'

export type AromaCardPiePreviewState = MobileAromaPreviewGateResult & {
  /** Keep the overlay mounted through fade-out after `viewAroma` clears. */
  active: boolean
  target: MobileAromaPreviewTarget | null
}

/**
 * Central CardPie aroma-cell preview (mobile + desktop).
 * Tile click sets `viewAroma`; this builds the image target and fade gate.
 */
export function useAromaCardPiePreview(): AromaCardPiePreviewState {
  const activeSection = useAppSelector(selectActiveSection)
  const viewAroma = useAppSelector(selectViewAroma)

  const target = useMemo((): MobileAromaPreviewTarget | null => {
    if (activeSection !== 'aroma') return null
    if (!viewAroma) return null
    const src = getAromaImage(viewAroma.index)
    if (!src) return null
    return { index: viewAroma.index, src }
  }, [activeSection, viewAroma])

  const gate = useMobileAromaPreviewGate(target)

  return {
    ...gate,
    target,
    active: target != null || gate.mounted != null,
  }
}
