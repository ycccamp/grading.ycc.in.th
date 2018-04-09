import React from 'react'
import styled from 'react-emotion'
import {Link, withRouter} from 'react-static'
import {Layout, Breadcrumb, BackTop} from 'antd'

import SideBar from './SideBar'

const getPath = () =>
  typeof window !== 'undefined'
    ? window.location.pathname.split('/').slice(1)
    : []

const BreadcrumbNav = () => (
  <Breadcrumb style={{margin: '24px 0'}}>
    <Breadcrumb.Item>
      <Link to="/">Dashboard</Link>
    </Breadcrumb.Item>
    {getPath().map(s => (
      <Breadcrumb.Item key={s} style={{textTransform: 'capitalize'}}>
        {s}
      </Breadcrumb.Item>
    ))}
  </Breadcrumb>
)

const Content = styled(Layout.Content)`
  margin: 0 auto;
  padding: 0 24px;

  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  width: 100%;
  min-height: 80vh;
`

const Dashboard = ({children}) => (
  <Layout>
    <SideBar />
    <Layout>
      <Content>
        <BreadcrumbNav />

        <Container>{children}</Container>
      </Content>
    </Layout>
    <BackTop />
  </Layout>
)

export default withRouter(Dashboard)
