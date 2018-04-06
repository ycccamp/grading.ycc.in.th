import lessToJS from 'less-vars-to-js'
import path from 'path'
import fs from 'fs'
import * as R from 'ramda'

import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'

function getLessLoader(stage) {
  const overrideFile = path.join(__dirname, 'src/ant.less')
  const themeVars = lessToJS(fs.readFileSync(overrideFile, 'utf8'))

  const lessLoader = {
    loader: 'less-loader',
    options: {
      sourceMap: true,
      modifyVars: themeVars,
      javascriptEnabled: true,
    },
  }

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      sourceMap: stage === 'dev',
      ident: 'postcss',
      plugins: () => [
        postcssFlexbugsFixes,
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // React doesn't support IE8 anyway
          ],
          flexbox: 'no-2009',
        }),
      ],
    },
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: stage !== 'dev',
      sourceMap: stage === 'dev',
    },
  }

  const prodLoader = ExtractTextPlugin.extract({
    fallback: {
      loader: 'style-loader',
      options: {
        hmr: false,
        sourceMap: false,
      },
    },
    use: [cssLoader, postCssLoader, lessLoader],
  })

  return {
    test: /\.less$/,
    use:
      stage === 'dev'
        ? ['style-loader', cssLoader, postCssLoader, lessLoader]
        : prodLoader,
  }
}

export default function webpack(config, {stage, defaultLoaders}) {
  config.resolve.extensions.push('.less')
  config.resolve.extensions.push('.css')

  const rules = config.module.rules[0]
  const lessLoader = getLessLoader(stage)
  rules.oneOf = R.insert(2, lessLoader, rules.oneOf)

  const extractTextPlugin = new ExtractTextPlugin({
    filename: getPath => {
      process.env.extractedCSSpath = 'styles.css'
      return getPath('styles.css')
    },
    allChunks: true,
  })

  config.plugins.push(extractTextPlugin)

  return config
}
