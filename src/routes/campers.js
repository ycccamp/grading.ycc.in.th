import React from 'react'

import Container from '../components/Container'
import {Total, Filter, Record} from '../components/Members'

const Members = () => (
  <div>
    <h1>สมาชิกทั้งหมด</h1>
    <Total />

    <Container>
      <Filter />
    </Container>

    <Record />
  </div>
)

export default Members
