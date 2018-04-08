import * as R from 'ramda'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {message} from 'antd'
import {createSelector} from 'reselect'
import {reset} from 'redux-form'

import rsf, {app} from '../core/fire'
import history from '../core/history'
import {createReducer, Creator} from './helper'
import {updateGrading, computeGrading} from '../core/grading'

export const SUBMIT = '@GRADING/SUBMIT'
export const DELIST = '@GRADING/DELIST'

export const SYNC_GRADING = '@GRADING/SYNC'
export const STORE_GRADING = '@GRADING/STORE'

export const submit = Creator(SUBMIT, 'id', 'data')
export const delist = Creator(DELIST)

export const syncGrading = Creator(SYNC_GRADING)
export const storeGrading = Creator(STORE_GRADING)

const db = app.firestore()

export const entrySelector = createSelector(
  s => s.camper.campers,
  (s, p) => p.match.params.id,
  (entries, id) => {
    return entries.find(camper => camper.id === id)
  },
)

export const submissionSelector = createSelector(
  s => s.camper.campers,
  s => s.grading.data,
  s => s.user.name,
  s => s.user.role,
  (campers, grades, name, role) => {
    return campers.map(camper => {
      const grading = grades.find(entry => entry.id === camper.id)

      return {
        ...camper,
        ...computeGrading(grading, name, role),
      }
    })
  },
)

// Proceed to next entries
export function* proceedSaga(id) {
  const entries = yield select(state => submissionSelector(state))
  yield put(reset('grading'))

  const index = entries.findIndex(x => x.id === id)

  if (index) {
    const entry = entries[index + 1]

    if (entry) {
      yield call(history.push, `/grade/${entry.id}`)
      return
    }
  }

  yield call(history.push, `/`)
}

export function* submitGradingSaga({payload: {id, data}}) {
  const {name, role} = yield select(s => s.user)
  const type = role === 'core' ? 'core' : 'major'
  const hide = message.loading('กำลังบันทึกผลการให้คะแนน กรุณารอสักครู่...', 0)

  try {
    data.scores = data.scores.map(score => parseInt(score))
    console.info('Submitting Grading for', id, 'as', data)

    yield call(updateGrading, id, data, name, type)
    yield call(message.success, `บันทึกผลการให้คะแนนเรียบร้อยแล้ว`)
  } catch (err) {
    console.warn('Grading Submission Error', err)
    message.error(err.message)
  } finally {
    hide()
    yield fork(proceedSaga, id)
  }
}

export function* delistSaga({payload: id}) {
  const hide = message.loading('กำลังคัดผู้สมัครออก กรุณารอสักครู่...', 0)

  try {
    const name = yield select(s => s.user.name)
    const doc = db.collection('grading').doc(id)
    const payload = {delisted: true, delistedBy: name}

    yield call(rsf.firestore.setDocument, doc, payload, {merge: true})
    yield call(message.success, `คัดผู้สมัครออกจากรายชื่อแล้ว`)
  } catch (err) {
    console.warn('Delisting Error', err)
    message.error(err.message)
  } finally {
    hide()
    yield fork(proceedSaga, id)
  }
}

export function* syncGradingSaga() {
  const records = db.collection('grading')

  yield fork(rsf.firestore.syncCollection, records, {
    successActionCreator: storeGrading,
  })
}

export function* gradingWatcherSaga() {
  yield takeEvery(SYNC_GRADING, syncGradingSaga)
  yield takeEvery(SUBMIT, submitGradingSaga)
  yield takeEvery(DELIST, delistSaga)
}

const initial = {
  data: [],
}

export default createReducer(initial, state => ({
  [STORE_GRADING]: ({docs}) => {
    const data = docs.map(doc => ({id: doc.id, ...doc.data()}))

    console.log('Grading Record:', data)

    return {...state, data}
  },
}))
