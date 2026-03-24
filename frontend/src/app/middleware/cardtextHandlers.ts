import { Editor, Transforms, Text as SlateText } from 'slate'
import { select, put } from 'redux-saga/effects'
import {
  selectCardtextState,
  selectFontSizeStep,
} from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { CARDTEXT_CONFIG, STEP_TO_PX } from '@cardtext/domain/types'

export function* changeFontSizeStep(
  editor: Editor,
  direction: 'more' | 'less',
) {
  const currentStep: number = yield select(selectFontSizeStep)
  const step = CARDTEXT_CONFIG.step

  let nextStep = currentStep
  if (direction === 'more' && currentStep < step) nextStep++
  if (direction === 'less' && currentStep > 1) nextStep--

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

export function* syncCardtextToolbarVisuals() {
  const currentStep: number = yield select(selectFontSizeStep)
  const maxStep = CARDTEXT_CONFIG.step

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'fontSizeLess',
      value: currentStep <= 1 ? 'disabled' : 'enabled',
    }),
  )

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'fontSizeMore',
      value: currentStep >= maxStep ? 'disabled' : 'enabled',
    }),
  )

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'left',
      value: 'active',
    }),
  )
}

