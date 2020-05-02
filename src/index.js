// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'

import store from './store/store'

window.addEventListener('DOMContentLoaded', (event) => {
  const domContainer = document.querySelector('#container')
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    domContainer)
})
