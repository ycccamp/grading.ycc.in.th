import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {Layout, Menu, Icon, message} from 'antd'
import {Link, withRouter} from 'react-static'
import {compose} from 'recompose'
import Ink from 'react-ink'
import axios from 'axios'

import logo from '../assets/notebook.svg'

import {logout} from '../ducks/user'
import roleName, {isAllowed} from '../core/roles'

const menus = [
  {
    title: 'ภาพรวม',
    path: '/',
    icon: 'dashboard',
    role: 'admin',
  },
  {
    title: 'ตรวจคำถามสาขา',
    path: '/',
    icon: 'file-text',
    role: 'grader',
  },
  {
    title: 'สรุปรายชื่อ',
    path: '/campers',
    icon: 'contacts',
    role: 'admin',
  },
]

const Logo = styled.img`
  width: 100%;
  height: 4em;
  background: transparent;
  margin-top: 1.5em;
  margin-bottom: 1.2em;
`

const Sider = styled(Layout.Sider)`
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
`

const path = typeof window !== 'undefined' ? window.location.pathname : '/'

const MenuItem = ({path, icon, title}) => (
  <Link to={path}>
    <Ink />
    <Icon type={icon} />
    <span>{title}</span>
  </Link>
)

const renderMenuItem = role => menu =>
  isAllowed(menu.role, role) && (
    <Menu.Item key={menu.path}>
      <MenuItem {...menu} />
    </Menu.Item>
  )

const Name = styled.div`
  color: #efefef;
  text-align: center;
  margin-bottom: 0.8em;

  display: ${props => (props.hidden ? 'none' : 'block')};
`

class SideBar extends Component {
  state = {collapsed: false}

  handleCollapse = () => this.setState({collapsed: !this.state.collapsed})

  render = () => {
    const {collapsed} = this.state
    const {username, role = 'none', logout} = this.props

    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.handleCollapse}>
        <Logo src={logo} />

        <Name hidden={collapsed}>
          <div>
            <span>ชื่อผู้ใช้: </span>
            <code>{username}</code>
          </div>
          <div>
            <small>({roleName(role)})</small>
          </div>
        </Name>

        <Menu theme="dark" defaultSelectedKeys={[path]} mode="inline">
          {menus.map(renderMenuItem(role))}

          <Menu.Item key="logout">
            <div onClick={() => logout()}>
              <Icon type="logout" />
              <span>ออกจากระบบ</span>
            </div>
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}

const mapStateToProps = state => ({
  username: state.user.name,
  role: state.user.role,
})

const enhance = compose(connect(mapStateToProps, {logout}), withRouter)

export default enhance(SideBar)
