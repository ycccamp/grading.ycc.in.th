import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {notification, message} from 'antd'
import {SubmissionError} from 'redux-form'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'
import {majorRoles} from '../core/roles'

export const ADD_CAMPER = 'ADD_CAMPER'

export const FETCH_CAMPER = 'FETCH_CAMPER'
export const STORE_CAMPER = 'STORE_CAMPER'

export const SYNC_CAMPERS = 'SYNC_CAMPERS'
export const STORE_CAMPERS = 'STORE_CAMPERS'

export const addCamper = Creator(ADD_CAMPER)
export const storeCamper = Creator(STORE_CAMPER)

export const syncCampers = Creator(SYNC_CAMPERS)
export const storeCampers = Creator(STORE_CAMPERS)

const db = app.firestore()

function getCollection(role) {
  let campers = db.collection('campers').where('submitted', '==', true)

  if (majorRoles.includes(role)) {
    campers = campers.where('major', '==', role)
  }

  return campers
}

export function* syncCampersSaga() {
  const role = yield select(s => s.user.role)
  const records = getCollection(role)

  yield fork(rsf.firestore.syncCollection, records, {
    successActionCreator: storeCampers,
  })
}

export function* camperWatcherSaga() {
  yield takeEvery(SYNC_CAMPERS, syncCampersSaga)
}

const initial = {
  camper: {},
  campers: [],
}

export default createReducer(initial, state => ({
  [STORE_CAMPERS]: ({docs}) => {
    const campers = docs.map((doc, number) => ({
      number: number + 1,
      id: doc.id,
      ...doc.data(),
    }))

    console.info('Retrieved', campers.length, 'Submissions')

    return {...state, campers}
  },
  [STORE_CAMPER]: camper => ({...state, camper}),
}))
