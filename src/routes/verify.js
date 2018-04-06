import React from 'react'
import {connect} from 'react-redux'

import VerifyForm from '../components/VerifyForm'
import {PageModal} from '../components/Layout'
import Container from '../components/Container'

const Verify = ({match: {params}}) => (
  <PageModal>
    <h1>ยืนยันการทำรายการ</h1>

    <Container>
      <VerifyForm id={params.id} />
    </Container>
  </PageModal>
)

const enhance = connect(null)

export default enhance(Verify)
