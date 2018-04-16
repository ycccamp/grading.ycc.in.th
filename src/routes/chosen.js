import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd'
import styled from 'react-emotion'

import Record from '../components/ChosenRecord'

import {setMajor, setAlternate, exportCampers} from '../ducks/campers'
import {majorRoles} from '../core/roles'

const ButtonGroup = Button.Group

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Campers = ({
  delisted,
  major,
  setMajor,
  alternate,
  setAlternate,
  exportCampers,
}) => (
  <div>
    <h1>ผู้ที่ได้รับการคัดเลือกสำหรับสาขา {major}</h1>

    <Row>
      <ButtonGroup style={{marginBottom: '2em'}}>
        {majorRoles.map(role => (
          <Button
            onClick={() => setMajor(role)}
            key={role}
            type={role === major && 'primary'}>
            {role}
          </Button>
        ))}
      </ButtonGroup>

      <ButtonGroup style={{marginBottom: '2em'}}>
        <Button onClick={exportCampers}>Export</Button>
        <Button
          type={alternate && 'primary'}
          onClick={() => setAlternate(true)}>
          ตัวสำรอง
        </Button>
        <Button
          type={!alternate && 'primary'}
          onClick={() => setAlternate(false)}>
          ตัวจริง
        </Button>
      </ButtonGroup>
    </Row>

    <Record />
  </div>
)

const mapStateToProps = state => ({
  major: state.camper.currentMajor,
  alternate: state.camper.alternate,
})

const enhance = connect(mapStateToProps, {
  setMajor,
  setAlternate,
  exportCampers,
})

export default enhance(Campers)
