import React from 'react'
import {Row, Col, Input, DatePicker} from 'antd'

import Label from '../../components/Label'

const FilterField = ({s = 8, label, style}) => (
  <Col span={s} style={style}>
    <Label>{label}:</Label>
    <Input placeholder={label} />
  </Col>
)

const CampersFilter = () => (
  <div>
    <Row gutter={16}>
      <FilterField label="ชื่อสมาชิก" />
      <FilterField label="ชื่อ-นามสกุล" />
      <FilterField label="เบอร์โทรศัพท์" />
    </Row>
    <Row gutter={16} style={{marginTop: '1em'}}>
      <Col span={8}>
        <Label>วันที่สมัคร:</Label>
        <DatePicker style={{width: '100%'}} placeholder="เลือกวันที่" />
      </Col>
      <FilterField label="ผู้ทำการสมัคร" />
      <Col span={8} />
    </Row>
  </div>
)

export default CampersFilter
