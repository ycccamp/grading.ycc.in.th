import * as R from 'ramda'
import {takeEvery, call, put, fork, select} from 'redux-saga/effects'
import {message} from 'antd'
import {createSelector} from 'reselect'
import {reset} from 'redux-form'

import rsf, {app} from '../core/fire'
import history from '../core/history'
import {createReducer, Creator} from './helper'
import {updateGrading, computeGrading, getGrading} from '../core/grading'

export const SET_PAGE = '@GRADING/SET_PAGE'
export const PROCEED = '@GRADING/PROCEED'
export const RESUME_PAGINATION = '@GRADING/RESUME_PAGINATION'

export const SUBMIT = '@GRADING/SUBMIT'
export const DELIST = '@GRADING/DELIST'

export const SYNC_GRADING = '@GRADING/SYNC'
export const STORE_GRADING = '@GRADING/STORE'

export const setPage = Creator(SET_PAGE)
export const proceed = Creator(PROCEED)
export const resumePagination = Creator(RESUME_PAGINATION)

export const submit = Creator(SUBMIT, 'id', 'data')
export const delist = Creator(DELIST)

export const syncGrading = Creator(SYNC_GRADING)
export const storeGrading = Creator(STORE_GRADING)

const db = app.firestore()

export const entrySelector = createSelector(
  s => s.camper.campers,
  (s, p) => p.match.params.id,
  (entries, id) => entries.find(camper => camper.id === id),
)

export const delistedSelector = createSelector(
  s => s.grading.data,
  (s, p) => p.id || p.match.params.id,
  (entries, id) => {
    const entry = entries.find(grading => grading.id === id)

    if (entry) {
      if (entry.delisted) {
        return entry.delistedBy
      }
    }
  },
)

export const gradingSelector = createSelector(
  s => s.grading.data,
  (s, p) => p.match.params.id,
  s => s.user.name,
  s => s.user.role,
  (entries, id, name, role) => {
    const grading = entries.find(grading => grading.id === id)

    if (grading) {
      return getGrading(grading, name, role, true)
    }

    return {}
  },
)

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

// Proceed to next entries
export function* proceedSaga(payload) {
  const id = payload.id || payload

  const entries = yield select(state => submissionSelector(state))
  yield put(reset('grading'))

  const index = entries.findIndex(x => x.id === id)

  if (Number.isInteger(index)) {
    const entry = entries[index + 1]

    if (entry) {
      yield call(history.push, `/grade/${entry.id}`)
      return
    }
  }

  yield call(history.push, `/`)
}

export function* submitGradingSaga({payload: {id, data}}) {
  const isDelisted = yield select(s => delistedSelector(s, {id}))

  if (isDelisted) {
    yield fork(proceedSaga, id)
    return
  }

  const {name, role} = yield select(s => s.user)
  const type = role === 'core' ? 'core' : 'major'
  const hide = message.loading('กำลังบันทึกผลการให้คะแนน กรุณารอสักครู่...', 0)

  try {
    data.scores = data.scores.map(score => parseInt(score))
    console.info('Submitting Grading for', id, 'as', data)

    yield call(updateGrading, id, data, name, type)
    yield call(message.success, `บันทึกผลการให้คะแนนเรียบร้อยแล้ว`)
  } catch (err) {
    console.warn('Grading Submission Error', err)
    message.error(err.message)
  } finally {
    hide()
    yield fork(proceedSaga, id)
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

const PAGE_SIZE = 10

export function* resumePaginationSaga() {
  const entries = yield select(state => submissionSelector(state))
  const {name, role} = yield select(state => state.user)

  // Determine where the grader previously left off
  const getLeftOff = R.findIndex(entry => {
    const grading = getGrading(entry, name, role, true)

    return !grading.delisted && !grading.scores
  })

  const entry = getLeftOff(entries)

  if (entry > -1) {
    const page = Math.ceil(entry / PAGE_SIZE)
    console.log('Resumed Pagination to page', page, 'at entry', entry)

    yield put(setPage(page))
  }
}

export function* gradingWatcherSaga() {
  yield takeEvery(SYNC_GRADING, syncGradingSaga)
  yield takeEvery(RESUME_PAGINATION, resumePaginationSaga)
  yield takeEvery(PROCEED, proceedSaga)
  yield takeEvery(SUBMIT, submitGradingSaga)
  yield takeEvery(DELIST, delistSaga)
}

const initial = {
  page: 1,
  data: [],
}

export default createReducer(initial, state => ({
  [SET_PAGE]: page => ({...state, page}),
  [STORE_GRADING]: ({docs}) => {
    const data = docs.map(doc => ({id: doc.id, ...doc.data()}))

    return {...state, data}
  },
}))
