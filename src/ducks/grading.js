import {takeEvery, call, put, fork, select} from 'redux-saga/effects'
import {message} from 'antd'
import {reset} from 'redux-form'

import rsf, {app} from '../core/fire'
import history from '../core/history'
import {updateGrading} from '../core/evaluation'

import {createReducer, Creator} from './helper'

import {
  submissionsSelector,
  evaluationSelector,
  delistedSelector,
  leftoffSelector,
} from './grading.selector'

export const SET_PAGE = '@GRADING/SET_PAGE'
export const RESUME_PAGINATION = '@GRADING/RESUME_PAGINATION'

export const SUBMIT = '@GRADING/SUBMIT'
export const DELIST = '@GRADING/DELIST'
export const SAVE_PHOTO_SCORE = '@GRADING/SAVE_PHOTO_SCORE'

export const SYNC_GRADING = '@GRADING/SYNC'
export const STORE_GRADING = '@GRADING/STORE'

export const SYNC_STAFFS = '@STAFFS/SYNC'
export const STORE_STAFFS = '@STAFFS/STORE'

export const setPage = Creator(SET_PAGE)
export const resumePagination = Creator(RESUME_PAGINATION)

export const submit = Creator(SUBMIT, 'id', 'data')
export const delist = Creator(DELIST)
export const savePhotoScore = Creator(SAVE_PHOTO_SCORE, 'id', 'score')

export const syncGrading = Creator(SYNC_GRADING)
export const storeGrading = Creator(STORE_GRADING)

export const syncStaffs = Creator(SYNC_STAFFS)
export const storeStaffs = Creator(STORE_STAFFS)

const db = app.firestore()

// Proceed to the next submission entry
export function* proceedSaga(id) {
  const entries = yield select(submissionsSelector)
  yield put(reset('grading'))

  const index = entries.findIndex(x => x.id === id)

  // If index of the next entry is found, navigate to that entry
  if (Number.isInteger(index)) {
    let idx = index
    while (entries[idx] && entries[idx].delisted) idx++

    const entry = entries[idx]
    console.log(entry)

    if (entry) {
      yield call(history.push, `/grade/${entry.id}`)
      return
    }
  }

  yield call(history.push, `/`)
}

// Submit the evaluation result
export function* submitGradingSaga({payload: {id, data}}) {
  const isDelisted = yield select(s => delistedSelector(s, id))

  if (isDelisted) {
    yield fork(proceedSaga, id)
    return
  }

  const {name, role} = yield select(s => s.user)
  const type = role === 'core' ? 'core' : 'major'
  const hide = message.loading('กำลังบันทึกผลการให้คะแนน กรุณารอสักครู่...', 0)

  try {
    if (data && data.scores) {
      data.scores = data.scores.map(score => parseInt(score))
      console.info('Submitting Grading for', id, 'as', data)

      yield call(updateGrading, id, data, name, type)
      yield call(message.success, `บันทึกผลการให้คะแนนเรียบร้อยแล้ว`)
    }
  } catch (err) {
    console.warn('Grading Submission Error', err)
    message.error(err.message)
  } finally {
    hide()
    yield fork(proceedSaga, id)
  }
}

export function* savePhotoScoreSaga({payload: {id, score}}) {
  const {scores} = yield select(s => evaluationSelector(s, id))
  scores[2] = parseInt(score) || 0

  const name = yield select(s => s.user.name)

  if (scores[2] > 25) {
    yield call(message.error, 'คะแนนต้องน้อยกว่า 25')

    return
  }

  try {
    yield call(updateGrading, id, {scores}, name, 'major')
    yield call(message.success, `บันทึกผลการให้คะแนนเรียบร้อยแล้ว`)
  } catch (err) {
    console.warn('Grading Submission Error', err)
    message.error(err.message)
  }
}

export function* delistSaga({payload: id}) {
  const hide = message.loading('กำลังคัดผู้สมัครออก กรุณารอสักครู่...', 0)

  try {
    const name = yield select(s => s.user.name)
    const doc = db.collection('grading').doc(id)
    const payload = {delisted: true, delistedBy: name, gradedAt: new Date()}

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

export function* syncStaffsSaga() {
  const records = db.collection('staffs')

  yield fork(rsf.firestore.syncCollection, records, {
    successActionCreator: storeStaffs,
  })
}

const PAGE_SIZE = 10

export function* resumePaginationSaga() {
  // Abort if the user is an administrator, not a grader
  const role = yield select(s => s.user.role)

  if (role === 'admin') {
    return
  }

  // Determine where the grader had left off previously, and resume to that page
  const entry = yield select(leftoffSelector)

  if (entry > -1) {
    const page = Math.ceil(entry / PAGE_SIZE)
    console.log('Resumed Pagination to page', page, 'at entry', entry)

    yield put(setPage(page))
  }
}

export function* gradingWatcherSaga() {
  yield takeEvery(SYNC_GRADING, syncGradingSaga)
  yield takeEvery(SYNC_STAFFS, syncStaffsSaga)
  yield takeEvery(RESUME_PAGINATION, resumePaginationSaga)
  yield takeEvery(SUBMIT, submitGradingSaga)
  yield takeEvery(DELIST, delistSaga)
  yield takeEvery(SAVE_PHOTO_SCORE, savePhotoScoreSaga)
}

const initial = {
  page: 1,
  data: [],
  staffs: [],
}

export default createReducer(initial, state => ({
  [SET_PAGE]: page => ({...state, page}),
  [STORE_GRADING]: ({docs}) => {
    const data = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, data}
  },
  [STORE_STAFFS]: ({docs}) => {
    const staffs = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, staffs}
  },
}))
