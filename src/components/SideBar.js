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

const menus = [
  {
    title: 'ภาพรวม',
    path: '/',
    icon: 'dashboard',
  },
  {
    title: 'รายการทั้งหมด',
    icon: 'book',
    children: [
      {
        title: 'รายการฝาก',
        path: '/transactions/deposit',
        icon: 'plus-square-o',
      },
      {
        title: 'รายการถอน',
        path: '/transactions/withdraw',
        icon: 'minus-square-o',
      },
    ],
  },
  {
    title: 'ทำรายการ',
    icon: 'wallet',
    children: [
      {
        title: 'นำฝาก',
        path: '/deposit',
        icon: 'plus-square-o',
      },
      {
        title: 'ถอนเงิน',
        path: '/withdraw',
        icon: 'minus-square-o',
      },
    ],
  },
  {
    title: 'สมาชิก',
    icon: 'team',
    children: [
      {
        title: 'ข้อมูลสมาชิก',
        path: '/members',
        icon: 'contacts',
      },
      {
        title: 'เพิ่มสมาชิก',
        path: '/members/add',
        icon: 'user-add',
      },
    ],
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

const SubMenuItem = ({icon, title}) => (
  <span>
    <Icon type={icon} />
    <span>{title}</span>
  </span>
)

const renderMenu = menu =>
  menu.children ? (
    <Menu.SubMenu key={menu.title} title={<SubMenuItem {...menu} />}>
      {menu.children.map(renderMenuItem)}
    </Menu.SubMenu>
  ) : (
    renderMenuItem(menu)
  )

const renderMenuItem = menu => (
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
    const {username, logout} = this.props

    return (
      <Sider collapsible collapsed={collapsed} onCollapse={this.handleCollapse}>
        <Logo src={logo} />

        <Name hidden={collapsed}>
          ผู้ทำรายการ: <code>{username}</code>
        </Name>

        <Menu theme="dark" defaultSelectedKeys={[path]} mode="inline">
          {menus.map(renderMenu)}

          <Menu.SubMenu
            key={'/account'}
            title={<SubMenuItem icon="idcard" title="บัญชีผู้ใช้" />}>
            <Menu.Item key="logout">
              <div onClick={() => logout()}>
                <Icon type="logout" />
                <span>ออกจากระบบ</span>
              </div>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
    )
  }
}

const mapStateToProps = state => ({
  username: state.user.email && state.user.email.replace('@jwc.in.th', ''),
})

const enhance = compose(connect(mapStateToProps, {logout}), withRouter)

export default enhance(SideBar)
