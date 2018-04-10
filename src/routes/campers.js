import React from 'react'
import {connect} from 'react-redux'

import Container from '../components/Container'
import {Filter, Record} from '../components/Campers'

import {totalSelector} from '../ducks/grading'

const Campers = ({total, delisted}) => (
  <div>
    <h1>
      ผู้สมัครทั้งหมด {total} คน | คัดออก {delisted} คน
    </h1>

    <Container>
      <Filter />
    </Container>

    <Record />
  </div>
)

const mapStateToProps = state => ({
  ...totalSelector(state),
})

const enhance = connect(mapStateToProps)

export default enhance(Campers)
