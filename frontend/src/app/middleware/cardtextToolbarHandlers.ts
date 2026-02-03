import { Editor, Transforms, Text as SlateText } from 'slate'
import { select, put } from 'redux-saga/effects'
import { selectFontSizeStep } from '@cardtext/infrastructure/selectors'
import { setFontSizeStep } from '@cardtext/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'

const STEP_TO_PX = [12, 14, 16, 18, 22, 28]

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
    yield put(setFontSizeStep(nextStep))

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
