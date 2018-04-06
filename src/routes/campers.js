import React from 'react'

import Container from '../components/Container'
import {Total, Filter, Record} from '../components/Campers'

const Campers = () => (
  <div>
    <h1>ผู้สมัครทั้งหมด</h1>
    <Total />

    <Container>
      <Filter />
    </Container>

    <Record />
  </div>
)

export default Campers
