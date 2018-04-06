import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {Link} from 'react-static'
import Ink from 'react-ink'
import {Col, Row, Icon} from 'antd'

import Dashboard from '../components/Dashboard'

import {logout} from '../ducks/user'

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

const Landing = ({username, logout}) => (
  <Dashboard>
    <h1>ผู้ทำรายการ: {username}</h1>

    <Row gutter={32} style={{marginTop: '1.5em'}}>
      <MenuItem to="/transactions/deposit" icon="book" title="รายการฝาก" />

      <MenuItem to="/transactions/withdraw" icon="copy" title="รายการถอน" />
    </Row>

    <Row gutter={32} style={{marginTop: '1em'}}>
      <MenuItem to="/deposit" icon="bank" title="นำฝาก" />

      <MenuItem to="/withdraw" icon="wallet" title="ถอนเงิน" />
    </Row>

    <Row gutter={32} style={{marginTop: '1em'}}>
      <MenuItem to="/members" icon="contacts" title="ข้อมูลสมาชิก" />

      <MenuItem to="/members/add" icon="user-add" title="เพิ่มสมาชิก" />
    </Row>

    <Row gutter={32} style={{marginTop: '1em'}}>
      <MenuItem onClick={logout} icon="logout" title="ออกจากระบบ" />
    </Row>
  </Dashboard>
)

const mapStateToProps = state => ({
  username: state.user.email && state.user.email.replace('@jwc.in.th', ''),
})

const enhance = connect(mapStateToProps, {logout})

export default enhance(Landing)
