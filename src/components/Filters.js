import React from 'react'
import {Col, Input, DatePicker} from 'antd'
import {connect} from 'react-redux'
import {compose} from 'recompose'

import Label from './Label'
import BankSelector from './BankSelector'
import AccountSelector from './BankAccountSelector'

import {setFilter} from '../ducks/filter'

const asField = Component => ({set, value, s = 6, style, label}) => (
  <Col span={s} style={style}>
    <Label>{label}:</Label>

    <Component
      style={{width: '100%'}}
      onChange={set}
      value={value}
      placeholder={label}
    />
  </Col>
)

const mapStateToProps = (state, props) => ({
  value: state.filter[props.name],
})

const mapDispatchToProps = (dispatch, props) => ({
  set: ev => {
    let value

    if (ev) {
      value = ev

      if (ev.target) {
        value = ev.target.value
      }
    }

    dispatch(setFilter(props.name, value))
  },
})

export const withField = Component => {
  const enhance = compose(connect(mapStateToProps, mapDispatchToProps), asField)

  return enhance(Component)
}

export const TextFilter = withField(Input)
export const DateFilter = withField(DatePicker)
export const BankFilter = withField(BankSelector)
export const AccountFilter = withField(AccountSelector)
