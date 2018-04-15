import React from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'antd'
import {reduxForm, Field} from 'redux-form'
import {compose} from 'recompose'
import {css} from 'react-emotion'

import ImagePreview from './PreviewAnswer/ImagePreview'

import {submissionsSelector} from '../ducks/grading.selector'

const imageStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;

  margin-top: 0.8em;
  margin-bottom: 0.8em;

  box-shadow: 0 1px 1.5px 1px rgba(0, 0, 0, 0.12);

  background-color: #fbfcff;
`

const GalleryForm = ({data}) => (
  <Row type="flex" justify="start" gutter={16}>
    {data.map(entry => (
      <Col span={6} key={entry.id}>
        <ImagePreview
          src={entry.majorAnswer3}
          id={entry.id}
          imageStyle={imageStyle}
        />
      </Col>
    ))}
  </Row>
)

const mapStateToProps = state => ({
  data: submissionsSelector(state),
})

const enhance = compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'grading',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  }),
)

export default enhance(GalleryForm)
