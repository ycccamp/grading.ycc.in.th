import React from 'react'
import {connect} from 'react-redux'

import Record from '../components/CampersRecord'

import {totalSelector} from '../ducks/grading.selector'

const Campers = ({total, delisted}) => (
  <div>
    <h1>
      ผู้สมัครทั้งหมด {total} คน | คัดออก {delisted} คน
    </h1>

    <Record />
  </div>
)

const enhance = connect(totalSelector)

export default enhance(Campers)
