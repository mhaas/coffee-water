import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import store from '../store/store'
import App from './App'

describe('App', () => {
  it('renders Zones tab without crashing', () => {
    expect(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      )
    }).not.toThrow()
  })

  it('switching to Mix Two Waters tab does not crash', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    const tabs = container.querySelectorAll('[role="tab"]')
    const mixTab = tabs.item(2) as HTMLElement
    expect(() => { mixTab.click() }).not.toThrow()
  })

  it('switching to Evaluate tab does not crash', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    const tabs = container.querySelectorAll('[role="tab"]')
    const evalTab = tabs.item(1) as HTMLElement
    expect(() => { evalTab.click() }).not.toThrow()
  })
})
