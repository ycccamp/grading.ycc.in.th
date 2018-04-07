import * as R from 'ramda'
import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {notification, message} from 'antd'
import {SubmissionError} from 'redux-form'
import {createSelector} from 'reselect'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'
import {updateGrading, computeGrading} from '../core/grading'

export const SUBMIT_GRADING = 'SUBMIT_GRADING'

export const SYNC_GRADING = 'SYNC_GRADING'
export const STORE_GRADING = 'STORE_GRADING'

export const submitGrading = Creator(SUBMIT_GRADING)

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
export function* submitGradingSaga({payload}) {
  const {name, role} = yield select(s => s.user)
  const type = role === 'core' ? 'core' : 'major'

  const {id, ...data} = payload

  try {
    yield call(updateGrading, id, data, name, type)

    yield call(message.info, `Updated Grading for ${id}!`)
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
