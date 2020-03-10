import axios from 'axios'
import {takeEvery, call, put, fork, select, all} from 'redux-saga/effects'
import {message} from 'antd'
import {createSelector} from 'reselect'

import {createReducer, Creator} from './helper'

export const SET_FILTER = 'SET_FILTER'
export const SAVE_FILTER = 'SAVE_FILTER'

export const setFilter = Creator(SET_FILTER, 'key', 'value')
export const saveFilter = Creator(SAVE_FILTER, 'key', 'value')

const firestoreFields = ['timestamp', 'recipient']

const fieldSelectors = fields =>
  fields.map(field => state => state.filter[field])

// prettier-ignore
export const createFilter = (selector, fields) => createSelector(
  selector,
  ...fieldSelectors(fields),
  (records, ...queries) => {
    records = records.filter(record => {
      for (const index in fields) {
        const name = fields[index]
        const field = record[name]
        const query = queries[index]

        if (query) {
          if (!field) return false

          if (!field.includes(query)) {
            return false
          }
        }
      }

      return true
    })

    return records
  },
)

const depositFields = ['ref', 'recordedBy', 'confirmedBy', 'camper', 'status']

export const depositFilter = createFilter(s => s.tx.deposit, depositFields)

const withdrawFields = ['ref', 'recordedBy', 'camper']

export const withdrawFilter = createFilter(s => s.tx.withdraw, withdrawFields)

export function* setFilterSaga({payload: {key, value}}) {
  yield put(saveFilter(key, value))

  // If the fields should be handled by firestore, run sync statement.
  if (firestoreFields.includes(key)) {
    console.info('Re-synchronizing due to change in', key)
  }
}

export function* filterWatcherSaga() {
  yield takeEvery(SET_FILTER, setFilterSaga)
}

const initial = {}

export default createReducer(initial, state => ({
  [SAVE_FILTER]: ({key, value}) => ({...state, [key]: value}),
}))
