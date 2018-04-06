import React from 'react'
import {Router, Route, Switch, Redirect} from 'react-static'
import {connect} from 'react-redux'
import styled from 'react-emotion'
import {Spin} from 'antd'
import StaticRoutes from 'react-static-routes'

import DashboardLayout from '../components/Dashboard'

import Dashboard from '../routes/dashboard'
import Login from '../routes/login'
import Verify from '../routes/verify'
import NotFound from '../routes/404'

import history from '../core/history'

const AuthRoutes = () => (
  <DashboardLayout>
    <Route exact path="/" component={Dashboard} />
    <Route path="/verify/:id" component={Verify} />
    <StaticRoutes />
  </DashboardLayout>
)

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: 100vh;
  min-height: 100vh;
`

const WillRedirect = ({ready}) => {
  if (ready) {
    return <Redirect to="/login" />
  }

  return (
    <Loading>
      <Spin size="large" tip="กำลังยืนยันตัวตนอีกครั้ง กรุณารอสักครู่..." />
    </Loading>
  )
}

const Routes = ({uid, ready}) => (
  <Router history={history}>
    <Switch>
      <Route
        path="/login"
        component={uid ? () => <Redirect to="/" /> : Login}
      />
      {uid ? <AuthRoutes /> : <WillRedirect ready={ready} />}
      <Route component={NotFound} />
    </Switch>
  </Router>
)

const mapStateToProps = state => ({
  uid: state.user.uid,
  ready: !state.user.loading,
})

const enhance = connect(mapStateToProps)

export default enhance(Routes)
