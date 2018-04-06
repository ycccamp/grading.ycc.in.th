import React from 'react'
import {Router, Route, Switch} from 'react-static'
import {connect} from 'react-redux'
import StaticRoutes from 'react-static-routes'

import NotFound from '../routes/404'

import history from '../core/history'

const Routes = ({uid, ready}) => (
  <Router history={history}>
    <Switch>
      <StaticRoutes />
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
