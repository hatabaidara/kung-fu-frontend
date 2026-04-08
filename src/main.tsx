import React from 'react'
import ReactDOM from 'react-dom/client'
import AppSimple from './AppSimple.tsx'
import './styles/index.css'
import './test-react-loading.js'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppSimple />
  </React.StrictMode>,
)
