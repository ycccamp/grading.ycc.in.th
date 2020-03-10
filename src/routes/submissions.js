import React from 'react'
import {connect} from 'react-redux'
import {compose, lifecycle} from 'recompose'

import {Record} from '../components/Evaluation'

import {resumePagination} from '../ducks/grading'
import {gradedSelector, totalSelector} from '../ducks/grading.selector'

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

const mapStateToProps = state => ({
  user: state.user,
  graded: gradedSelector(state),
  ...totalSelector(state),
})

const enhance = compose(
  connect(
    mapStateToProps,
    {resumePagination},
  ),
  lifecycle({
    componentDidMount() {
      this.props.resumePagination()
    },
  }),
)

export default enhance(Submissions)
