const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'awesome-editor.js',
    library: {
      name: 'AwesomeEditor',
      type: 'umd',
      export: 'default'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {}
      }
    ]
  },
  watch: true,
  mode: 'development'
}