// infrastructure/sagas/cardtextToolbarSaga.ts
import { takeLatest, put } from 'redux-saga/effects'
import { ReactEditor } from 'slate-react'
import { Editor, Transforms } from 'slate'
import { toolbarAction } from '@toolbar/application/helpers'
import { initCardtext } from '@cardtext/infrastructure/state'
import { initialCardtextValue } from '@cardtext/domain/types'
import { updateToolbarSection } from '@toolbar/infrastructure/state'

function* toggleMarkSaga(
  editor: ReactEditor,
  format: 'bold' | 'italic' | 'underline'
) {
  if (!editor.selection) return
  const marks = Editor.marks(editor) || {}
  const isActive = marks[format] === true

  if (isActive) {
    Editor.removeMark(editor, format)
    yield put(
      updateToolbarSection({
        section: 'cardtext',
        value: { [format]: 'enabled' },
      })
    )
  } else {
    Editor.addMark(editor, format, true)
    yield put(
      updateToolbarSection({
        section: 'cardtext',
        value: { [format]: 'active' },
      })
    )
  }
}

function* setAlignSaga(
  editor: ReactEditor,
  value: 'left' | 'center' | 'right' | 'justify'
) {
  if (!editor.selection) return

  Transforms.setNodes(
    editor,
    { align: value },
    {
      match: (n) =>
        !Editor.isEditor(n) &&
        ['paragraph', 'heading', 'quote'].includes((n as any).type),
    }
  )

  yield put(
    updateToolbarSection({
      section: 'cardtext',
      value: {
        left: value === 'left' ? 'active' : 'enabled',
        center: value === 'center' ? 'active' : 'enabled',
        right: value === 'right' ? 'active' : 'enabled',
        justify: value === 'justify' ? 'active' : 'enabled',
      },
    })
  )
}

function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload
  if (section !== 'cardtext') return

  const editor: ReactEditor = (window as any).cardtextEditor

  switch (key) {
    case 'bold':
    case 'italic':
    case 'underline':
      yield* toggleMarkSaga(editor, key)
      break

    case 'left':
    case 'center':
    case 'right':
    case 'justify':
      yield* setAlignSaga(editor, key)
      break

    case 'save':
      console.log('Saving cardtext...')
      break
    case 'remove':
      yield put(initCardtext(initialCardtextValue))
      break
    case 'textTemplates':
      console.log('Applying text template...')
      break

    default:
      break
  }
}

export function* cardtextToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardtextToolbarAction)
}
