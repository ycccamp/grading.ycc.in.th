import React from 'react'
import {Spin} from 'antd'
import styled from 'react-emotion'
import {connect} from 'react-redux'
import {Router, Route, Switch} from 'react-static'

import Layout from '../components/Dashboard'

import Login from '../routes/login'
import Dashboard from '../routes/dashboard'
import Candidates from '../routes/candidates'

import Submissions from '../routes/submissions'
import Grading from '../routes/evaluate'
import Gallery from '../routes/gallery'
import Choose from '../routes/choose'
import Chosen from '../routes/chosen'

import CandidatePreview from '../routes/candidatePreview'
import CandidateSummary from '../routes/candidateSummary'
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

const Notice = styled.h1`
  font-size: 2.8em;
  font-weight: 500;

  color: #555;
  text-align: center;
  width: 100%;
`

const graderRoles = ['core', 'design', 'marketing', 'programming', 'content']

function getByRole(role) {
  if (role === 'admin') {
    return Dashboard
  }

  if (graderRoles.includes(role)) {
    return Submissions
  }

  return () => <Notice>สิทธิในการเข้าถึงไม่เพียงพอ</Notice>
}

const AuthRoutes = ({user}) => {
  if (user.uid) {
    return (
      <Layout>
        <Route path="/" component={getByRole(user.role)} exact />
        <Route path="/grade/:id" component={Grading} />
        <Route path="/preview/:id" component={CandidatePreview} />
        <Route path="/summary/:id" component={CandidateSummary} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/candidates" component={Candidates} />
        <Route path="/choose" component={Choose} />
        <Route path="/chosen" component={Chosen} />
      </Layout>
    )
  }

  if (!user.loading) {
    return <Login />
  }

  return (
    <Page>
      <Spin size="large" />
    </Page>
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
