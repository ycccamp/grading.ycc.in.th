import React, {Component} from 'react'
import {extractCritical} from 'emotion-server'

import webpack from './webpack.config.js'

const siteRoot = 'https://grading.ycc.in.th'

class Document extends Component {
  render() {
    const {Html, Head, Body, children, renderMeta} = this.props

    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style dangerouslySetInnerHTML={{__html: renderMeta.css}} />
          <link
            href="https://fonts.googleapis.com/css?family=Kanit:300,400|Taviraj"
            rel="stylesheet"
          />
        </Head>
        <Body>{children}</Body>
      </Html>
    )
  }
}

export default {
  webpack,
  siteRoot,
  getSiteProps: () => ({
    title: 'YCC Grading',
    siteRoot,
  }),
  getRoutes: async () => [
    {
      path: '/',
      component: 'src/routes/dashboard',
    },
    {
      path: '/login',
      component: 'src/routes/login',
    },
    {
      path: 404,
      component: 'src/routes/404',
    },
  ],
  renderToHtml: (render, Comp, meta) => {
    const html = render(<Comp />)
    meta.css = extractCritical(html).css
    return html
  },
  Document,
}
