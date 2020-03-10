import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd'
import styled from 'react-emotion'

import CamperSelector from '../components/CamperSelector'

import {setMajor, chooseCampers} from '../ducks/campers'
import {majorRoles} from '../core/roles'

const ButtonGroup = Button.Group

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Campers = ({delisted, major, setMajor, chooseCampers}) => (
  <div>
    <h1>คัดเลือกผู้สมัครสำหรับสาขา {major}</h1>

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
        <Button onClick={() => chooseCampers('cancel')}>ยกเลิกการเลือก</Button>
        <Button onClick={() => chooseCampers('alternate')}>
          เลือกตัวสำรอง
        </Button>
        <Button onClick={() => chooseCampers()}>เลือกตัวจริง</Button>
      </ButtonGroup>
    </Row>

    <CamperSelector />
  </div>
)

const mapStateToProps = state => ({
  major: state.camper.currentMajor,
})

const enhance = connect(
  mapStateToProps,
  {setMajor, chooseCampers},
)

export default enhance(Campers)
