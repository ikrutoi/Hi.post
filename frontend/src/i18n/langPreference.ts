import { useSyncExternalStore } from 'react'
import { DEFAULT_LANG } from './config'
import { normalizeLang } from './helpers'
import type { Lang } from './types'

const STORAGE_KEY = 'lang'

export type LangPreference = 'auto' | Lang

type LangSnapshot = {
  preference: LangPreference
  active: Lang
  detected: Lang
}

function browserLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG
  const candidates = [...(navigator.languages ?? []), navigator.language]
  for (const candidate of candidates) {
    if (!candidate) continue
    const normalized = normalizeLang(candidate)
    if (normalized) return normalized
  }
  return DEFAULT_LANG
}

export function readLangPreference(): LangPreference {
  if (typeof localStorage === 'undefined') return 'auto'
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw == null || raw.trim() === '' || raw === 'auto') return 'auto'
  return normalizeLang(raw) ?? 'auto'
}

export function resolveActiveLang(
  preference: LangPreference = readLangPreference(),
): Lang {
  return preference === 'auto' ? browserLang() : preference
}

function createSnapshot(): LangSnapshot {
  const preference = readLangPreference()
  return {
    preference,
    active: resolveActiveLang(preference),
    detected: browserLang(),
  }
}

let snapshot = createSnapshot()

const listeners = new Set<() => void>()

export function getLangSnapshot(): LangSnapshot {
  return snapshot
}

export function getActiveLang(): Lang {
  return snapshot.active
}

export function subscribeLang(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setLangPreference(preference: LangPreference): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, preference)
  }
  snapshot = createSnapshot()
  for (const listener of listeners) listener()
}

export function useLangSnapshot(): LangSnapshot {
  return useSyncExternalStore(subscribeLang, getLangSnapshot, getLangSnapshot)
}
