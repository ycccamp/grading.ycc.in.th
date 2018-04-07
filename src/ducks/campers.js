import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {notification, message} from 'antd'
import {SubmissionError} from 'redux-form'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'

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

const None = 'ไม่พบข้อมูล'

export async function fetchCamper(username, dispatch) {
  let camper = {}

  try {
    const docRef = db.collection('campers').doc(username)
    const snapshot = await docRef.get()

    camper = {id: snapshot.id, ...snapshot.data()}
  } catch (err) {
    message.error(err.message)
  }

  console.log('Fetching Camper:', username, '->', camper)

  if (!camper.name) {
    message.warn('ไม่พบผู้สมัครดังกล่าวในระบบ')

    await dispatch(storeCamper({name: None, account: None}))

    throw {camper: 'ไม่พบผู้สมัครดังกล่าวในระบบ'}
  }

  if (dispatch) {
    await dispatch(storeCamper(camper))
  }

  return camper
}

export function* syncCampersSaga() {
  const cols = db.collection('campers')

  yield fork(rsf.firestore.syncCollection, cols, {
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
    const campers = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, campers}
  },
  [STORE_CAMPER]: camper => ({...state, camper}),
}))
