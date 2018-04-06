import styled from 'react-emotion'

export const TotalContainer = styled.div`
  position: absolute;
  right: 0;
  top: -2.3em;

  color: #666;
  text-align: right;
  font-size: 1.3em;
  font-weight: 500;

  @media screen and (max-height: 800px) {
    top: -3em;
  }
`

export const Title = styled.div`
  font-size: 1.3em;
`

export const Currency = styled.strong`
  color: #555;
  font-size: 1.1em;
`
