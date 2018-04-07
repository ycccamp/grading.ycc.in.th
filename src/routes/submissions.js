import React from 'react'
import {connect} from 'react-redux'

import {createSelector} from 'reselect'

import Record from '../components/SubmissionsRecord'

import roleOf from '../core/roles'

const Submissions = ({graded, total, user}) => (
  <div>
    <h1>
      <span>
        รายชื่อตรวจคำถาม (ตรวจแล้ว {graded} จาก {total} คน)
      </span>
    </h1>

    <Record />
  </div>
)

const gradedSelector = createSelector(
  s => s.grading.data,
  s => s.user.role,
  s => s.user.name,
  (entries, role, name) => {
    const type = role === 'core' ? 'core' : 'major'

    return entries.filter(x => x[type] && x[type][name]).length
  },
)

const mapStateToProps = state => ({
  user: state.user,
  graded: gradedSelector(state),
  total: state.camper.campers.length,
})

const enhance = connect(mapStateToProps)

export default enhance(Submissions)
