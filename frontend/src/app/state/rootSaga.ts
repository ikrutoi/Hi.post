import { all, fork } from 'redux-saga/effects'
import { cardEditorSaga, envelopeSaga } from '../middleware'

export function* rootSaga() {
  yield all([fork(cardEditorSaga), fork(envelopeSaga)])
}
