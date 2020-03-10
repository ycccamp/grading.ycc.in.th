import {message} from 'antd'
import {takeEvery, call, put, select, all} from 'redux-saga/effects'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'
import {majorRoles} from '../core/roles'

export const ADD_CAMPER = 'ADD_CAMPER'

export const CHOOSE_CAMPER = 'CHOOSE_CAMPER'
export const CHOOSE_CAMPERS = 'CHOOSE_CAMPERS'

export const SET_MAJOR = 'SET_MAJOR'
export const SET_ALTERNATE = 'SET_ALTERNATE'
export const SET_SELECTED = 'SET_SELECTED'
export const STORE_CAMPER = 'STORE_CAMPER'

export const SYNC_CAMPERS = 'SYNC_CAMPERS'
export const STORE_CAMPERS = 'STORE_CAMPERS'

export const addCamper = Creator(ADD_CAMPER)

export const chooseCamper = Creator(CHOOSE_CAMPER, 'id', 'mode')
export const chooseCampers = Creator(CHOOSE_CAMPERS)

export const setMajor = Creator(SET_MAJOR)
export const setAlternate = Creator(SET_ALTERNATE)
export const setSelected = Creator(SET_SELECTED)
export const storeCamper = Creator(STORE_CAMPER)

export const syncCampers = Creator(SYNC_CAMPERS)
export const storeCampers = Creator(STORE_CAMPERS)

const db = app.firestore()

function getCollection(role) {
  let campers = db.collection('registration').where('isLocked', '==', true)

  if (majorRoles.includes(role)) {
    campers = campers.where('track', '==', role)
  }

  return campers
}

const retrieveData = async doc => {
  const $forms = await db
    .collection('registration')
    .doc(doc.id)
    .collection('forms')
    .get()

  const forms = {}

  for (let form of $forms.docs) {
    let field = form.id
    if (field === 'track') field = 'major'

    forms[field] = form.data()
  }

  return {id: doc.id, ...forms, ...doc.data()}
}

const sortBySubmitted = (a, b) => a.timestamp - b.timestamp

export function* syncCampersSaga() {
  const role = yield select(s => s.user.role)
  const collection = getCollection(role)
  const data = yield call(() => collection.get())

  const dataB = yield call(() =>
    Promise.all(data.docs.sort(sortBySubmitted).map(retrieveData)),
  )

  yield put(storeCampers(dataB))
}

export function* chooseCamperSaga({payload: {id, mode}}) {
  const hide = message.loading('กำลังเลือกผู้สมัคร กรุณารอสักครู่...', 0)

  const isAlternate = mode === 'alternate'
  const isSelected = mode !== 'cancel'

  const payload = {
    selected: isSelected,
    alternate: isSelected && isAlternate,
  }

  const doc = db.collection('grading').doc(id)
  yield call(rsf.firestore.setDocument, doc, payload, {merge: true})

  yield call(hide)

  let msg = `เลือกตัวจริงเรียบร้อยแล้ว`

  if (isAlternate) {
    msg = `เลือกตัวสำรองเรียบร้อยแล้ว`
  }

  if (!isSelected) {
    msg = `ยกเลิกการเลือกผู้สมัครเรียบร้อยแล้ว`
  }

  yield call(message.success, msg)
}

// Nominate the selected campers to be chosen for YCC
export function* chooseCampersSaga({payload: mode}) {
  const selected = yield select(s => s.camper.selected)
  const hide = message.loading('กำลังเลือกผู้สมัคร กรุณารอสักครู่...', 0)

  const isAlternate = mode === 'alternate'
  const isSelected = mode !== 'cancel'

  const payload = {
    selected: isSelected,
    alternate: isSelected && isAlternate,
  }

  yield all(
    selected.map(id => {
      const doc = db.collection('grading').doc(id)

      return call(rsf.firestore.setDocument, doc, payload, {merge: true})
    }),
  )

  yield call(hide)

  let msg = `เลือกตัวจริง ${selected.length} คนเรียบร้อยแล้ว`

  if (isAlternate) {
    msg = `เลือกตัวสำรอง ${selected.length} คนเรียบร้อยแล้ว`
  }

  if (!isSelected) {
    msg = `ยกเลิกการเลือกผู้สมัคร ${selected.length} คนเรียบร้อยแล้ว`
  }

  // prettier-ignore
  yield call(message.success, msg)
}

export function* camperWatcherSaga() {
  yield takeEvery(CHOOSE_CAMPER, chooseCamperSaga)
  yield takeEvery(CHOOSE_CAMPERS, chooseCampersSaga)
  yield takeEvery(SYNC_CAMPERS, syncCampersSaga)
}

const initial = {
  alternate: false,
  currentMajor: 'developer',
  camper: {},
  campers: [],
  selected: [],
}

export default createReducer(initial, state => ({
  [STORE_CAMPER]: camper => ({...state, camper}),
  [SET_MAJOR]: currentMajor => ({...state, currentMajor}),
  [SET_SELECTED]: selected => ({...state, selected}),
  [SET_ALTERNATE]: alternate => ({...state, alternate}),
  [STORE_CAMPERS]: campers => {
    console.info('Retrieved', campers.length, 'Submissions')

    window.campers = campers

    return {...state, campers}
  },
}))
