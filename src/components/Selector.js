import React from 'react'
import {Select} from 'antd'
import {Field} from 'redux-form'
import {withProps} from 'recompose'
import {SelectField} from 'redux-form-antd'

import Label from './Label'

const {Option} = Select

export const Selector = ({options, ...props}) => (
  <Select allowClear={true} style={{width: '100%'}} {...props}>
    {options.map(item => (
      <Option key={item.value} value={item.value}>
        {item.label}
      </Option>
    ))}
  </Select>
)

export const makeSelect = options => withProps({options})(Selector)

export const SelectorField = ({label = 'บัญชีธนาคาร:', ...props}) => (
  <div>
    <Label>{label}</Label>
    <Field component={SelectField} style={{width: '100%'}} {...props} />
  </div>
)

export const makeSelectField = options => withProps({options})(SelectorField)

export default Selector
