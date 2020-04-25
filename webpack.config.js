const path = require('path')

module.exports = {
  entry:  ['react-hot-loader/patch', './src/index.js'],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", "json"],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  devtool: 'inline-source-map',
  optimization: {
    usedExports: true
  }
}
