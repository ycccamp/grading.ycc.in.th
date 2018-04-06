import React from 'react'
import {connect} from 'react-redux'
import styled from 'react-emotion'

import Container from '../components/Container'
import LoginForm from '../components/LoginForm'

import {login} from '../ducks/user'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin: 0 auto;
  padding: 1em;

  max-width: 400px;
  min-height: 100vh;
`

const Login = ({login}) => (
  <Page>
    <h1>เข้าสู่ระบบ</h1>

    <Container>
      <LoginForm onSubmit={login} />
    </Container>
  </Page>
)

export default connect(null, {login})(Login)
