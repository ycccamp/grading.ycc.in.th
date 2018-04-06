import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {notification, message} from 'antd'
import {SubmissionError} from 'redux-form'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'

export const ADD_MEMBER = 'ADD_MEMBER'

export const FETCH_MEMBER = 'FETCH_MEMBER'
export const STORE_MEMBER = 'STORE_MEMBER'

export const SYNC_CAMPERS = 'SYNC_CAMPERS'
export const STORE_CAMPERS = 'STORE_CAMPERS'

export const addCamper = Creator(ADD_MEMBER)
export const storeCamper = Creator(STORE_MEMBER)

export const syncCampers = Creator(SYNC_CAMPERS)
export const storeCampers = Creator(STORE_CAMPERS)

const db = app.firestore()

// Fields: account bank fullname line note phone username
export function* addCamperSaga({payload}) {
  const email = yield select(s => s.user.email)
  console.log('Add Camper:', payload)

  payload.createdAt = new Date()
  payload.createdBy = email.replace('@jwc.in.th', '')

  try {
    const docRef = db.collection('campers').doc(payload.username)
    yield call(rsf.firestore.setDocument, docRef, payload, {merge: true})

    yield call(message.info, `Camper ${payload.username} is added.`)
  } catch (err) {
    message.error(err.message)
  }
}

const None = 'ไม่พบข้อมูล'

export async function fetchCamper(username, dispatch) {
  let member = {}

  try {
    const docRef = db.collection('campers').doc(username)
    const snapshot = await docRef.get()

    member = {id: snapshot.id, ...snapshot.data()}
  } catch (err) {
    message.error(err.message)
  }

  console.log('Fetching Camper:', username, '->', member)

  if (!member.name) {
    message.warn('ไม่พบสมาชิกดังกล่าวในระบบ')

    await dispatch(storeCamper({name: None, account: None}))

    throw {member: 'ไม่พบสมาชิกดังกล่าวในระบบ'}
  }

  if (dispatch) {
    await dispatch(storeCamper(member))
  }

  return member
}

export function* syncCampersSaga() {
  const cols = db.collection('campers')

  yield fork(rsf.firestore.syncCollection, cols, {
    successActionCreator: storeCampers,
  })
}

export function* memberWatcherSaga() {
  yield takeEvery(ADD_MEMBER, addCamperSaga)
  yield takeEvery(SYNC_CAMPERS, syncCampersSaga)
}

const initial = {
  member: {},
  campers: [],
}

export default createReducer(initial, state => ({
  [STORE_CAMPERS]: ({docs}) => {
    const campers = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, campers}
  },
  [STORE_MEMBER]: member => ({...state, member}),
}))
