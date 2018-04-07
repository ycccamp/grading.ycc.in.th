import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {notification, message} from 'antd'
import {SubmissionError} from 'redux-form'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'

export const UPDATE_GRADING = 'UPDATE_GRADING'

export const SYNC_GRADING = 'SYNC_GRADING'
export const STORE_GRADING = 'STORE_GRADING'

export const updateGrading = Creator(UPDATE_GRADING)

export const syncGrading = Creator(SYNC_GRADING)
export const storeGrading = Creator(STORE_GRADING)

const db = app.firestore()

// Fields: account bank fullname line note phone username
export function* updateGradingSaga({payload}) {
  const name = yield select(s => s.user.name)

  payload.gradedAt = new Date()
  payload.gradedBy = name

  try {
    const docRef = db.collection('grading').doc(payload.username)
    yield call(rsf.firestore.setDocument, docRef, payload, {merge: true})

    yield call(message.info, `Grading ${payload.username} is added.`)
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
  grading: [],
}

export default createReducer(initial, state => ({
  [STORE_GRADING]: ({docs}) => {
    const grading = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, grading}
  },
}))
