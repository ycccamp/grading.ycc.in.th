import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'antd'

import CamperSelector from '../components/CamperSelector'

import {setMajor} from '../ducks/campers'

import {majorRoles} from '../core/roles'

const ButtonGroup = Button.Group

const Campers = ({delisted, major, setMajor}) => (
  <div>
    <h1>คัดเลือกผู้สมัครสำหรับสาขา {major}</h1>

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

    <CamperSelector />
  </div>
)

const mapStateToProps = state => ({
  major: state.camper.currentMajor,
})

const enhance = connect(mapStateToProps, {setMajor})

export default enhance(Campers)
