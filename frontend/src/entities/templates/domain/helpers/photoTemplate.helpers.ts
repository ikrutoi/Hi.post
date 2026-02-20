import {
  type CardphotoTemplate,
  type CreateCardphotoTemplatePayload,
} from '../types/cardphotoTemplate.types'
import type {
  PhotoMonetization,
  PhotoTemplateStats,
} from '../types/monetization.types'

export function createDefaultPhotoTemplate(
  payload: CreateCardphotoTemplatePayload,
  userId: string,
): Omit<CardphotoTemplate, 'localId' | 'createdAt' | 'updatedAt'> {
  const now = Date.now()

  return {
    userId,
    image: payload.image,
    source: payload.source,
    theme: payload.theme,
    imageBlob: payload.imageBlob,
    name: payload.name,
    visibility: payload.visibility || 'private',
    isPublic: payload.visibility === 'public',
    isModerated: false,
    isApproved: false,
    monetization: {
      enabled: payload.monetizationEnabled || false,
      pricePerUse: payload.pricePerUse,
      totalEarnings: 0,
      totalUses: 0,
    },
    stats: {
      views: 0,
      uses: 0,
    },
    serverId: null,
    syncedAt: null,
    isDirty: false,
  }
}

export function incrementPhotoViews(
  template: CardphotoTemplate,
): CardphotoTemplate {
  return {
    ...template,
    stats: {
      ...template.stats,
      views: template.stats.views + 1,
    },
  }
}

export function incrementPhotoUses(
  template: CardphotoTemplate,
  tokensEarned: number = 0,
): CardphotoTemplate {
  const now = Date.now()

  return {
    ...template,
    stats: {
      ...template.stats,
      uses: template.stats.uses + 1,
      lastUsedAt: now,
    },
    monetization: {
      ...template.monetization,
      totalUses: template.monetization.totalUses + 1,
      totalEarnings: template.monetization.totalEarnings + tokensEarned,
    },
  }
}

export function canUsePhoto(template: CardphotoTemplate): boolean {
  return template.visibility === 'public' && template.isApproved
}

export function getPhotoUsageCost(template: CardphotoTemplate): number {
  if (!template.monetization.enabled || !canUsePhoto(template)) {
    return 0
  }
  return template.monetization.pricePerUse || 0
}
