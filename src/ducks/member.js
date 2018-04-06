import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {notification, message} from 'antd'
import {SubmissionError} from 'redux-form'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'

export const ADD_MEMBER = 'ADD_MEMBER'

export const FETCH_MEMBER = 'FETCH_MEMBER'
export const STORE_MEMBER = 'STORE_MEMBER'

export const SYNC_MEMBERS = 'SYNC_MEMBERS'
export const STORE_MEMBERS = 'STORE_MEMBERS'

export const addMember = Creator(ADD_MEMBER)
export const storeMember = Creator(STORE_MEMBER)

export const syncMembers = Creator(SYNC_MEMBERS)
export const storeMembers = Creator(STORE_MEMBERS)

const db = app.firestore()

// Fields: account bank fullname line note phone username
export function* addMemberSaga({payload}) {
  const email = yield select(s => s.user.email)
  console.log('Add Member:', payload)

  payload.createdAt = new Date()
  payload.createdBy = email.replace('@jwc.in.th', '')

  try {
    const docRef = db.collection('members').doc(payload.username)
    yield call(rsf.firestore.setDocument, docRef, payload, {merge: true})

    yield call(message.info, `Member ${payload.username} is added.`)
  } catch (err) {
    message.error(err.message)
  }
}

const None = 'ไม่พบข้อมูล'

export async function fetchMember(username, dispatch) {
  let member = {}

  try {
    const docRef = db.collection('members').doc(username)
    const snapshot = await docRef.get()

    member = {id: snapshot.id, ...snapshot.data()}
  } catch (err) {
    message.error(err.message)
  }

  console.log('Fetching Member:', username, '->', member)

  if (!member.name) {
    message.warn('ไม่พบสมาชิกดังกล่าวในระบบ')

    await dispatch(storeMember({name: None, account: None}))

    throw {member: 'ไม่พบสมาชิกดังกล่าวในระบบ'}
  }

  if (dispatch) {
    await dispatch(storeMember(member))
  }

  return member
}

export function* syncMembersSaga() {
  const cols = db.collection('members')

  yield fork(rsf.firestore.syncCollection, cols, {
    successActionCreator: storeMembers,
  })
}

export function* memberWatcherSaga() {
  yield takeEvery(ADD_MEMBER, addMemberSaga)
  yield takeEvery(SYNC_MEMBERS, syncMembersSaga)
}

const initial = {
  member: {},
  members: [],
}

export default createReducer(initial, state => ({
  [STORE_MEMBERS]: ({docs}) => {
    const members = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, members}
  },
  [STORE_MEMBER]: member => ({...state, member}),
}))
