import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { Layout } from '../components/layout/Layout'
import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: (
      <PrivateRoute>
        <Layout>
          <HomePage />
        </Layout>
      </PrivateRoute>
    ),
  },
])