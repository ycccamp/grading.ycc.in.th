import React from 'react'
import {css} from 'react-emotion'
import {connect} from 'react-redux'
import {Link} from 'react-static'

import Button from '../components/Button'
import Records from '../components/Records'

import {setSelected} from '../ducks/campers'
import {topCampersSelector} from '../ducks/campers.selector'

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
  totalScore: {
    title: 'คะแนนรวม 100',
    render: num => num && num.toFixed(2),
  },
  coreScore: {
    title: 'คะแนนกลาง 40',
    render: num => num && num.toFixed(2),
  },
  majorScore: {
    title: 'คะแนนสาขา 60',
    render: num => num && num.toFixed(2),
  },
  status: {
    title: 'สถานะ',
    render: (text, record) => {
      if (record.alternate) {
        return 'สำรอง'
      }

      if (record.selected) {
        return 'ตัวจริง'
      }

      return '-'
    },
    width: 80,
  },
  more: {
    title: 'ดูเพิ่มเติม',
    render: (text, record) => (
      <Link to={`/preview/${record.id}`}>
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
  data: topCampersSelector(state),
})

const enhance = connect(
  mapStateToProps,
  {setSelected},
)

export default enhance(CampersRecord)
