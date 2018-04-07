import {all} from 'redux-saga/effects'
import storage from 'redux-persist/lib/storage'
import {persistCombineReducers} from 'redux-persist'
import {reducer as form} from 'redux-form'

import user, {reauthSaga, userWatcherSaga} from './user'
import camper, {camperWatcherSaga} from './campers'
import filter, {filterWatcherSaga} from './filter'

const config = {
  key: 'root',
  storage,
  throttle: 2000,
  blacklist: ['user'],
}

export const reducers = persistCombineReducers(config, {
  user,
  camper,
  filter,
  form,
})

export function* rootSaga() {
  yield all([
    reauthSaga(),
    userWatcherSaga(),
    camperWatcherSaga(),
    filterWatcherSaga(),
  ])
}
