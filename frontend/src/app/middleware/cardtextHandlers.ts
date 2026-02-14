import { Editor, Transforms, Text as SlateText } from 'slate'
import { select, put, call } from 'redux-saga/effects'
import { nanoid } from 'nanoid'
import { selectActiveSource } from '@cardphoto/infrastructure/selectors'
import {
  selectCardtextSessionData,
  selectCardtextState,
  selectFontSizeStep,
} from '@cardtext/infrastructure/selectors'
import { selectCardOrientation } from '@layout/infrastructure/selectors'
import { setAssetId, setTextStyle } from '@cardtext/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  CARDTEXT_CONFIG,
  CardtextSessionRecord,
  STEP_TO_PX,
} from '@cardtext/domain/types'
import type { LayoutOrientation } from '@layout/domain/types'
import { CardtextRecord } from '@db/types'
import { storeAdapters } from '@db/adapters/storeAdapters'

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
  const orientation: LayoutOrientation = yield select(selectCardOrientation)
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

  const cardphotoSource: string | null = yield select(selectActiveSource)
  const isUserBranch = cardphotoSource === 'user'

  yield put(
    updateToolbarIcon({
      section: 'cardtext',
      key: 'cardOrientation',
      value: {
        state: isUserBranch ? 'enabled' : 'disabled',
        options: { orientation },
      },
    }),
  )
}

export function* syncCardtextToAssets() {
  const session: CardtextSessionRecord = yield select(selectCardtextSessionData)

  if (!session.plainText.trim()) return

  const record: CardtextRecord = {
    id: session.assetId || nanoid(),
    value: session.value,
    style: session.style,
    plainText: session.plainText,
    cardtextLines: session.cardtextLines,
  }

  yield call([storeAdapters.cardtext, 'put'], record)

  if (!session.assetId) {
    yield put(setAssetId(record.id))
  }
}
