import { Editor, Transforms, Text as SlateText } from 'slate'
import { call, put, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  selectCardtextState,
  selectFontSizeStep,
} from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  CARDTEXT_CONFIG,
  STEP_TO_PX,
  clampCardtextFontSizeStep,
} from '@cardtext/domain/types'

const CARDTEXT_FONT_TOOLBAR_SECTIONS = [
  'cardtext',
  'cardtextEditor',
  'cardtextCreate',
] as const

export function* changeFontSizeStep(
  editor: Editor,
  direction: 'more' | 'less',
) {
  const currentStep: number = yield select(selectFontSizeStep)
  const step = CARDTEXT_CONFIG.step

  let nextStep = clampCardtextFontSizeStep(currentStep)
  if (direction === 'more' && nextStep < step) nextStep++
  if (direction === 'less' && nextStep > 1) nextStep--
  nextStep = clampCardtextFontSizeStep(nextStep)

  if (nextStep !== currentStep) {
    yield put(setTextStyle({ fontSizeStep: nextStep }))

    const pxSize = STEP_TO_PX[nextStep - 1]

    // Transforms.setNodes(
    //   editor,
    //   { fontSize: pxSize },
    //   {
    //     match: (n) => SlateText.isText(n),
    //     split: true,
    //   },
    // )
  }
}

/** True when `nextStep` would make the open editor scroll. */
function cardtextFontStepOverflows(nextStep: number): boolean {
  if (typeof document === 'undefined') return false
  const area = document.querySelector('[data-cardtext-editor-area]')
  const editable = area?.querySelector('[data-slate-editor]')
  if (
    !(area instanceof HTMLElement) ||
    !(editable instanceof HTMLElement) ||
    area.clientHeight < 1
  ) {
    return false
  }

  const nextPx = STEP_TO_PX[nextStep - 1]
  if (nextPx == null) return false
  const nextLineHeight = Math.round(nextPx * 1.5)
  const prevFontSize = editable.style.fontSize
  const prevLineHeight = editable.style.lineHeight

  editable.style.fontSize = `calc(${nextPx}px * var(--cardtext-font-scale, 1))`
  editable.style.lineHeight = `calc(${nextLineHeight}px * var(--cardtext-font-scale, 1))`
  const overflows = area.scrollHeight > area.clientHeight + 1
  editable.style.fontSize = prevFontSize
  editable.style.lineHeight = prevLineHeight
  return overflows
}

/** Composer: one icon cycles upward. A step that would not fit wraps to the smallest. */
export function* cycleFontSizeStep() {
  const currentStep: number = yield select(selectFontSizeStep)
  const maxStep = CARDTEXT_CONFIG.step
  const clamped = clampCardtextFontSizeStep(currentStep)
  let nextStep = clamped >= maxStep ? 1 : clamped + 1

  if (nextStep !== 1 && clamped > 1) {
    const overflows: boolean = yield call(cardtextFontStepOverflows, nextStep)
    if (overflows) nextStep = 1
  }

  yield put(setTextStyle({ fontSizeStep: nextStep }))
}

export function* syncCardtextToolbarVisuals() {
  yield call(syncFontSizeButtonsStatus)
}

export function* syncFontSizeButtonsStatus(): SagaIterator {
  const currentStep: number = yield select(selectFontSizeStep)
  const maxStep = CARDTEXT_CONFIG.step

  for (const section of CARDTEXT_FONT_TOOLBAR_SECTIONS) {
    yield put(
      updateToolbarIcon({
        section,
        key: 'fontSizeLess',
        value: currentStep <= 1 ? 'disabled' : 'enabled',
      }),
    )
    yield put(
      updateToolbarIcon({
        section,
        key: 'fontSizeMore',
        value: currentStep >= maxStep ? 'disabled' : 'enabled',
      }),
    )
  }
}

