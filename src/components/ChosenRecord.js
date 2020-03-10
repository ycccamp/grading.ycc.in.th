import React from 'react'
import {css} from 'react-emotion'
import {connect} from 'react-redux'
import {Link} from 'react-static'

import Button from '../components/Button'
import Records from '../components/Records'

import {setSelected} from '../ducks/campers'
import {chosenSelector} from '../ducks/campers.selector'

import {grades, genders, religions} from '../core/options'

const fields = {
  number: {
    title: 'no.',
    width: 50,
    render: (text, record, index) => <code>{index + 1}</code>,
  },
  id: {
    title: 'รหัสอ้างอิง',
    render: text => <small>{text}</small>,
  },
  firstname: {
    title: 'ชื่อ',
    width: 100,
  },
  lastname: {
    title: 'นามสกุล',
    width: 100,
  },
  age: {
    title: 'อายุ',
    width: 80,
  },
  gender: {
    title: 'เพศ',
    width: 80,
    render: text => genders[text] || text,
  },
  class: {
    title: 'ชั้นเรียน',
    render: text => grades[text] || text,
  },
  phone: 'เบอร์โทรศัพท์',
  facebookDisplayName: 'ชื่อ Facebook',
  more: {
    title: 'ดูเพิ่มเติม',
    render: (text, record) => (
      <Link to={`/summary/${record.id}`}>
        <Button icon="export" />,
      </Link>
    ),
    width: 100,
  },
}

const alternateStyle = css`
  background: #81ecec;
`

const selectedStyle = css`
  background: #55efc4;
`

function highlightRows(record, index) {
  if (record.alternate) {
    return alternateStyle
  }

  if (record.selected) {
    return selectedStyle
  }
}

const CampersRecord = ({campers, setSelected, ...props}) => (
  <Records
    fields={fields}
    rowSelection={{onChange: setSelected}}
    maxWidth={130}
    rowClassName={highlightRows}
    rowKey="id"
    pagination={{pageSize: 30}}
    {...props}
  />
)

const mapStateToProps = state => ({
  data: chosenSelector(state),
})

const enhance = connect(
  mapStateToProps,
  {setSelected},
)

export default enhance(CampersRecord)
