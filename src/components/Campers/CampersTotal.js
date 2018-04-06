import React from 'react'

import {TotalContainer, Title, Currency} from '../Total'

const CampersTotal = () => (
  <TotalContainer>
    <Title>ยอดสรุป</Title>
    <div>
      สมาชิก <Currency>1,000</Currency> คน
    </div>
  </TotalContainer>
)

export default CampersTotal
