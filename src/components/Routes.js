import React from 'react'
import {Spin} from 'antd'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {Router, Route, Switch} from 'react-static'

import Layout from '../components/Dashboard'

import Login from '../routes/login'
import Dashboard from '../routes/dashboard'
import Campers from '../routes/campers'
import NotFound from '../routes/404'

import history from '../core/history'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;
`

const AuthRoutes = ({user}) => {
  if (user.loading) {
    return (
      <Page>
        <Spin size="large" />
      </Page>
    )
  }

  if (!user.uid) {
    return <Login />
  }

  return (
    <Layout>
      <Route path="/" component={Dashboard} exact />
      <Route path="/campers" component={Campers} />
    </Layout>
  )
}

const Routes = ({user}) => (
  <Router history={history}>
    <Switch>
      <Route path="/login" component={Login} />
      <AuthRoutes user={user} />
      <Route component={NotFound} />
    </Switch>
  </Router>
)

const mapStateToProps = state => ({
  user: state.user,
})

const enhance = connect(mapStateToProps)

export default enhance(Routes)
