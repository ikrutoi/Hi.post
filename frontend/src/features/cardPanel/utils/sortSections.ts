import type { SectionMeta } from '@/shared/types/sections.types'

export function sortSections(
  sections: SectionMeta[],
  by: 'position' | 'index' = 'position'
): SectionMeta[] {
  return [...sections].sort((a, b) => a[by] - b[by])
}

export function getSortedActiveSections(
  activeMap: Record<string, boolean>,
  baseSections: Record<string, SectionMeta>
): SectionMeta[] {
  const active = Object.keys(activeMap)
    .filter((key) => activeMap[key])
    .map((key) => baseSections[key])

  return sortSections(active, 'position')
}
