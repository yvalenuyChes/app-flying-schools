import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles/styles.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import School from './pages/School/School.jsx'

const router = createBrowserRouter([
  {
    path :'/',
    element: <App/>
  },
  {
    path:'/:schoolName',
    element: <School/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
