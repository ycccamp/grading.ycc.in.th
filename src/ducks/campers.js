import React from 'react'
import {message, Modal} from 'antd'
import {takeEvery, call, fork, select, all} from 'redux-saga/effects'

import {createReducer, Creator} from './helper'
import rsf, {app} from '../core/fire'
import {majorRoles} from '../core/roles'

import {campersSelector} from './campers.selector'

export const ADD_CAMPER = 'ADD_CAMPER'

export const CHOOSE_CAMPER = 'CHOOSE_CAMPER'
export const CHOOSE_CAMPERS = 'CHOOSE_CAMPERS'
export const EXPORT_CAMPERS = 'EXPORT_CAMPERS'

export const SET_MAJOR = 'SET_MAJOR'
export const SET_ALTERNATE = 'SET_ALTERNATE'
export const SET_SELECTED = 'SET_SELECTED'
export const STORE_CAMPER = 'STORE_CAMPER'

export const SYNC_CAMPERS = 'SYNC_CAMPERS'
export const STORE_CAMPERS = 'STORE_CAMPERS'

export const addCamper = Creator(ADD_CAMPER)

export const chooseCamper = Creator(CHOOSE_CAMPER, 'id', 'mode')
export const chooseCampers = Creator(CHOOSE_CAMPERS)
export const exportCampers = Creator(EXPORT_CAMPERS)

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

export function* syncCampersSaga() {
  const role = yield select(s => s.user.role)
  const records = yield call(getCollection, role)

  yield fork(rsf.firestore.syncCollection, records, {
    successActionCreator: storeCampers,
  })
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

const withMajorIndex = (item, index) => ({
  ...item,
  majorIndex: index,
})

// 1 - 12
// 13 - 24
// 25 - 36
// 37 - 48
const majorAmt = {
  design: 0,
  marketing: 0.12,
  content: 0.24,
  programming: 0.36,
}

// prettier-ignore
const withData = item => ({
  id: item.majorIndex + 1,
  name: `${item.firstname} ${item.lastname}`,
  amount: (200 + 0.01 * (item.majorIndex + 1) + majorAmt[item.major]).toFixed(2),
})

function filterCandidate(data, track) {
  return data
    .filter(x => x.track === major)
    .sort((a, b) => a.firstname.localeCompare(b.firstname))
    .map(withMajorIndex)
    .map(withData)
}

function generateCamperData(data) {
  return {
    design: filterCandidate(data, 'design'),
    marketing: filterCandidate(data, 'marketing'),
    content: filterCandidate(data, 'content'),
    developer: filterCandidate(data, 'developer'),
  }
}

export function* exportCampersSaga() {
  const candidates = yield select(campersSelector)

  const selected = candidates.filter(x => x.selected && !x.alternate)
  const alternate = candidates.filter(x => x.alternate)

  const data = {
    real: generateCamperData(selected),
    unreal: generateCamperData(alternate),
  }

  yield call(Modal.success, {
    content: (
      <div style={{whiteSpace: 'pre-wrap'}}>
        {JSON.stringify(data, null, 2)}
      </div>
    ),
  })
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
      const doc = db.collection('registration').doc(id)

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
  yield takeEvery(EXPORT_CAMPERS, exportCampersSaga)
  yield takeEvery(SYNC_CAMPERS, syncCampersSaga)
}

const initial = {
  alternate: false,
  currentMajor: 'content',
  camper: {},
  campers: [],
  selected: [],
}

const retrieveData = doc => ({id: doc.id, ...doc.data()})

const sortBySubmitted = (a, b) => a.updatedAt - b.updatedAt

export default createReducer(initial, state => ({
  [STORE_CAMPER]: camper => ({...state, camper}),
  [SET_MAJOR]: currentMajor => ({...state, currentMajor}),
  [SET_SELECTED]: selected => ({...state, selected}),
  [SET_ALTERNATE]: alternate => ({...state, alternate}),
  [STORE_CAMPERS]: ({docs}) => {
    const campers = docs
      .sort(sortBySubmitted)
      .map(retrieveData)
      .filter(x => x.majorAnswer1)

    console.info('Retrieved', campers.length, 'Submissions')

    return {...state, campers}
  },
}))
