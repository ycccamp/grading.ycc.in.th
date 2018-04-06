import {all} from 'redux-saga/effects'
import storage from 'redux-persist/lib/storage'
import {persistCombineReducers} from 'redux-persist'
import {reducer as form} from 'redux-form'

import user, {reauthSaga, userWatcherSaga} from './user'
import member, {memberWatcherSaga} from './member'
import filter, {filterWatcherSaga} from './filter'

const config = {
  key: 'root',
  storage,
  throttle: 2000,
}

export const reducers = persistCombineReducers(config, {
  user,
  member,
  filter,
  form,
})

export function* rootSaga() {
  yield all([
    reauthSaga(),
    userWatcherSaga(),
    memberWatcherSaga(),
    filterWatcherSaga(),
  ])
}
