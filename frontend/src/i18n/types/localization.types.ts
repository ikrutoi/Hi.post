export type TranslationValue = string

export type EnvelopeTranslations = {
  title: TranslationValue
  description: TranslationValue
  'button.send': TranslationValue
  'button.cancel': TranslationValue
}

export type EnvelopeTranslationKey = keyof EnvelopeTranslations

export type TranslationsMap<T> = {
  [lang in import('./lang.types').Lang]: T
}
