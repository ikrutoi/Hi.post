import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
// import { store } from './store'
import { store } from '@app/state/store'
import './index.scss'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
