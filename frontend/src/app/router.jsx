import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ProtectApp from './ProtectApp'
import PublicLayout from './PublicLayout'
import Landing from '../pages/landing/Landing'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import ProtectRoute from '../store/ProtectRoute'
import PostDashboard from '../pages/posts/PostDashboard'
import PostAll from '../pages/posts/PostAll'
import PostEdit from '../pages/posts/PostEdit'
import PostCreate from '../pages/posts/PostCreate'
import PostDetail from '../pages/posts/PostDetail'
import Profile from '../pages/profile/Profile'
import Manage from '../pages/manage/Manage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectRoute>
        <ProtectApp />
      </ProtectRoute>
    ),
    children: [
      { index: true, element: <PostDashboard /> },
      { path: 'posts/all', element: <PostAll /> },
      { path: 'posts/new', element: <PostCreate /> },
      { path: 'posts/:id', element: <PostDetail /> },
      { path: 'posts/:id/edit', element: <PostEdit /> },
      { path: 'profile', element: <Profile /> },
      { path: 'manage', element: <Manage /> },
    ],
  },
])
