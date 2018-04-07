import * as R from 'ramda'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {message} from 'antd'
import {createSelector} from 'reselect'

import rsf, {app} from '../core/fire'
import history from '../core/history'
import {createReducer, Creator} from './helper'
import {updateGrading, computeGrading} from '../core/grading'

export const SUBMIT_GRADING = 'SUBMIT_GRADING'

export const SYNC_GRADING = 'SYNC_GRADING'
export const STORE_GRADING = 'STORE_GRADING'

export const submitGrading = Creator(SUBMIT_GRADING, 'id', 'data')

export const syncGrading = Creator(SYNC_GRADING)
export const storeGrading = Creator(STORE_GRADING)

const db = app.firestore()

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

window.updateGrading = updateGrading

// Fields: account bank fullname line note phone username
export function* submitGradingSaga({payload: {id, data}}) {
  const {name, role} = yield select(s => s.user)
  const type = role === 'core' ? 'core' : 'major'

  try {
    data.scores = data.scores.map(score => parseInt(score))

    console.info('Submitting Grading for', id, 'as', data)
    yield call(updateGrading, id, data, name, type)

    yield call(history.push, '/')

    yield call(
      message.success,
      `บันทึกผลการให้คะแนนสำหรับ ${id} เรียบร้อยแล้ว!`,
    )
  } catch (err) {
    console.warn('Update Grading', err)
    message.error(err.message)
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
  yield takeEvery(SUBMIT_GRADING, submitGradingSaga)
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
