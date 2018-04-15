import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {Link} from 'react-static'
import Ink from 'react-ink'
import {Col, Row, Icon} from 'antd'

import {logout} from '../ducks/user'

import roleName from '../core/roles'

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  margin: 0 auto;
  margin-bottom: 1.5em;

  width: 100%;
  padding: 0.8em;
  position: relative;
  transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);

  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 25px;

  color: #666;
  font-size: 1.5em;

  &:hover {
    color: #efefef;
    background: #2d2d30;
  }
`

const MenuIcon = styled(Icon)`
  font-size: 1.8em;
  margin-right: 1em;
`

const MenuItem = ({to = '/', onClick, icon, title, style, s = 12}) => (
  <Col span={s} style={style}>
    <Link to={to} style={{textDecoration: 'none'}}>
      <Menu onClick={onClick}>
        <Ink />
        <MenuIcon type={icon} />
        <div>{title}</div>
      </Menu>
    </Link>
  </Col>
)

const Landing = ({username, role = 'none', logout}) => (
  <div>
    <h1 style={{marginBottom: '1.5em'}}>
      ผู้ใช้ปัจจุบัน: {username} ({roleName(role)})
    </h1>

    <Row gutter={32} style={{marginTop: '1em'}}>
      <MenuItem to="/choose" icon="select" title="คัดเลือกผู้สมัคร" />
      <MenuItem to="/chosen" icon="trophy" title="ผู้ผ่านการคัดเลือก" />
    </Row>

    <Row gutter={32} style={{marginTop: '1em'}}>
      <MenuItem to="/candidates" icon="contacts" title="สรุปรายชื่อ" />
      <MenuItem onClick={logout} icon="logout" title="ออกจากระบบ" />
    </Row>
  </div>
)

const mapStateToProps = state => ({
  username: state.user.name,
  role: state.user.role,
})

const enhance = connect(mapStateToProps, {logout})

export default enhance(Landing)
