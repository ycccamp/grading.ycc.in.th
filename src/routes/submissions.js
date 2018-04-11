import React from 'react'
import {connect} from 'react-redux'
import {compose, lifecycle} from 'recompose'
import {createSelector} from 'reselect'

import Record from '../components/SubmissionsRecord'

import {resumePagination} from '../ducks/grading'
import {totalSelector} from '../ducks/grading.selector'

const Submissions = ({graded, total, delisted, user}) => (
  <div>
    <h1>
      <span>รายชื่อตรวจคำถาม </span>
      <span>
        (ตรวจแล้ว {graded} จาก {total} คน | คัดออก {delisted} คน)
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

    return entries.filter(x => x[type] && x[type][name] && !x.delisted).length
  },
)

const mapStateToProps = state => ({
  user: state.user,
  graded: gradedSelector(state),
  ...totalSelector(state),
})

const enhance = compose(
  connect(mapStateToProps, {resumePagination}),
  lifecycle({
    componentDidMount() {
      this.props.resumePagination()
    },
  }),
)

export default enhance(Submissions)
