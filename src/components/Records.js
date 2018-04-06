import React from 'react'
import styled from 'react-emotion'
import {withProps} from 'recompose'
import {Table} from 'antd'

const RecordTable = styled(Table)`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 25px;

  thead {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 25px;
  }

  .ant-pagination.ant-table-pagination {
    padding-right: 1.5em;
  }
`

const Records = ({data, scrollX, scrollY = 300, cols, ...props}) => (
  <RecordTable
    dataSource={data}
    columns={cols}
    scroll={{x: scrollX, y: scrollY}}
    {...props}
  />
)

const enhance = withProps(props => {
  const cols = Object.entries(props.fields)
    .map(([dataIndex, data]) => {
      return data.title ? {dataIndex, ...data} : {dataIndex, title: data}
    })
    .map(col => ({...col, width: col.width || 150}))

  return {
    cols,
    scrollX: cols.reduce((acc, item) => acc + item.width, 0),
  }
})

export default enhance(Records)
