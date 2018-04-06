import {TimePicker} from 'antd'
import moment from 'moment'

import createComponent from 'redux-form-antd/es/components/BaseComponent'
import {customMap} from 'redux-form-antd/es/components/mapError'

const format = 'HH:mm:ss'

const timePickerMap = customMap(({input: {onChange, value}}) => {
  if (value !== '') {
    value = moment(value, format)
  }

  return {onChange: (e, v) => onChange(v), value, format}
})

export default createComponent(TimePicker, timePickerMap)
