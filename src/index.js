import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

window.addEventListener('DOMContentLoaded', (event) => {
  const domContainer = document.querySelector('#container')
  ReactDOM.render(<App />, domContainer)
})
