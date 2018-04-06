import axios from 'axios'
import * as R from 'ramda'
import {message} from 'antd'
import {untouch} from 'redux-form'
import {takeEvery, call, put, fork, select} from 'redux-saga/effects'

import {createReducer, Creator} from './helper'
import {syncCampers} from './member'

import rsf, {app} from '../core/fire'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const STORE_USER = 'STORE_USER'
export const CLEAR_USER = 'CLEAR_USER'
export const SET_LOADING = 'SET_LOADING'

export const login = Creator(LOGIN)
export const logout = Creator(LOGOUT)

export const storeUser = Creator(STORE_USER)
export const clearUser = Creator(CLEAR_USER)
export const setLoading = Creator(SET_LOADING)

const db = app.firestore()

const userProps = R.pick([
  'uid',
  'displayName',
  'email',
  'phoneNumber',
  'photoURL',
  'metadata',
])

const UserNotFoundNotice = `ไม่พบบัญชีผู้ใช้ที่ตรงกับชื่อดังกล่าวอยู่ในระบบ`
const WrongPasswordNotice = `รหัสผ่านดังกล่าวไม่ถูกต้อง กรุณาตรวจสอบความถูกต้องอีกครั้ง`
const WelcomeNotice = `การลงชื่อเข้าใช้สำเร็จ ยินดีต้อนรับ`

export function* loginSaga({payload: {username, password}}) {
  const hide = message.loading(`กำลังเข้าสู่ระบบด้วยชื่อผู้ใช้ ${username}`, 0)

  try {
    const mail = `${username}@jwc.in.th`
    const user = yield call(rsf.auth.signInWithEmailAndPassword, mail, password)

    yield call(hide)
    yield call(message.success, `${WelcomeNotice}, ${username}!`)
    yield fork(authRoutineSaga, user, true)
  } catch (err) {
    yield call(hide)
    yield put(untouch('login', 'username', 'password'))

    if (err.code === 'auth/user-not-found') {
      message.error(UserNotFoundNotice)
    } else if (err.code === 'auth/wrong-password') {
      message.error(WrongPasswordNotice)
    } else {
      console.warn(err.code, err.message)
      message.error(err.message)
    }
  }
}

export function* logoutSaga() {
  const hide = message.loading(`กำลังออกจากระบบ...`, 0)

  try {
    yield call(rsf.auth.signOut)

    yield call(hide)
    yield call(message.success, 'คุณได้ออกจากระบบเรียบร้อยแล้ว')

    yield put(clearUser())
  } catch (err) {
    yield call(hide)
    message.error(err.message)
  }
}

// Routines to perform when the user begins or resumes their session
export function* authRoutineSaga(user) {
  try {
    const docRef = db.collection('staffs').doc(user.uid)
    const doc = yield call(rsf.firestore.getDocument, docRef)

    if (!doc.exists) {
      yield call(message.error, `ไม่พบข้อมูลสำหรับบัญชีของคุณในระบบ`)
      return
    }

    // Merge the user's record with their credentials
    const record = doc.data()
    const data = {...userProps(user), ...record}

    yield put(storeUser(data))
    yield put(syncCampers())
  } catch (err) {
    message.error(err.message)
  }
}

const getUserStatus = () =>
  new Promise((resolve, reject) => {
    app.auth().onAuthStateChanged(resolve, reject)
  })

// Attempt to re-authenticate when user resumes their session
export function* reauthSaga() {
  try {
    const user = yield call(getUserStatus)

    if (user) {
      yield call(message.info, `ยินดีต้อนรับกลับ, ${user.email}!`)
      yield fork(authRoutineSaga, user)
    }
  } catch (err) {
    message.warn(err.message)
  } finally {
    yield put(setLoading(false))
  }
}

export function* userWatcherSaga() {
  yield takeEvery(LOGIN, loginSaga)
  yield takeEvery(LOGOUT, logoutSaga)
}

const initial = {
  loading: true,
}

export default createReducer(initial, state => ({
  [SET_LOADING]: loading => ({...state, loading}),
  [STORE_USER]: user => user,
  [CLEAR_USER]: () => ({}),
}))
