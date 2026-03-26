import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ProtectApp from './ProtectApp'
import PublicLayout from './PublicLayout'
import Landing from '../pages/landing/Landing'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import Dashboard from '../pages/dashboard/Dashboard'
import ProtectRoute from '../store/ProtectRoute'
export const router = createBrowserRouter([
  {
    // 공개영역
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> }
    ]
  }, {
    // 보호영역
    path:'/app',
    element:(
      <ProtectRoute>
        <ProtectApp/>
      </ProtectRoute>
    ),
    children:[
      {
        index:true,
        element:<Dashboard/>
      }
    ]
  }
])
