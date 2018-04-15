import React from 'react'
import * as R from 'ramda'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import {compose} from 'recompose'
import styled, {css} from 'react-emotion'
import {TextField} from 'redux-form-antd'
import {createSelector} from 'reselect'
import LazyLoad from 'react-lazyload'

import ImagePreview from './PreviewAnswer/ImagePreview'

import {savePhotoScore} from '../ducks/grading'
import {evaluationsSelector} from '../ducks/grading.selector'

const imageStyle = css`
  position: relative;
  z-index: 2;

  width: 100%;
  min-height: 300;

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
  min-width: 24%;
  max-width: 24%;
`

const GalleryForm = ({data, save}) => (
  <Row>
    {data.map(entry => (
      <Col key={entry.id}>
        <LazyLoad height={600} once>
          <ImagePreview id={entry.id} imageStyle={imageStyle} />
        </LazyLoad>

        <Field
          name={entry.id}
          component={TextField}
          placeholder="คะแนน (เต็ม 25)"
          onBlur={save}
        />
      </Col>
    ))}
  </Row>
)

const initialSelector = createSelector(evaluationsSelector, entries =>
  entries
    .map(entry => ({[entry.id]: entry.scores ? entry.scores[2] : 0}))
    .reduce(R.merge),
)

const mapStateToProps = state => ({
  data: evaluationsSelector(state),
  initialValues: initialSelector(state),
})

const mapDispatchToProps = dispatch => ({
  save: (event, value, _, id) => dispatch(savePhotoScore(id, value)),
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'gallery',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
  }),
)

export default enhance(GalleryForm)
