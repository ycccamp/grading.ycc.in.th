import React from 'react'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import {compose} from 'recompose'
import styled, {css} from 'react-emotion'
import {TextField} from 'redux-form-antd'

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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  flex: 1;
  min-width: 23%;
  max-width: 23%;
`

const GalleryForm = ({data}) => (
  <Row>
    {data.map(entry => (
      <Col key={entry.id}>
        <ImagePreview
          src={entry.majorAnswer3}
          id={entry.id}
          imageStyle={imageStyle}
        />

        <Field
          name={entry.id}
          component={TextField}
          placeholder={`คะแนน (เต็ม 25)`}
        />
      </Col>
    ))}
  </Row>
)

const mapStateToProps = state => ({
  data: submissionsSelector(state).filter(x => !x.delisted),
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
