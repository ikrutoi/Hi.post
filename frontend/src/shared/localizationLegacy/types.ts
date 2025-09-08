import { Lang } from './lang'

export type TranslationValue = string

export type EnvelopeTranslations = {
  title: TranslationValue
  description: TranslationValue
  'button.send': TranslationValue
  'button.cancel': TranslationValue
}

export type TranslationsMap<T> = {
  [lang in Lang]: T
}

export type EnvelopeTranslationKey = keyof EnvelopeTranslations
