import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import Categories from './pages/Categories'
import AddCategory from './pages/AddCategory'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Reports from './pages/Reports'
import Users from './pages/Users'
import AddUser from './pages/AddUser'

const PrivateOutlet = () => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <PrivateOutlet />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/add",
        element: <AddProduct />,
      },
      {
        path: "products/:id",
        element: <Products />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/add",
        element: <AddCategory />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "transactions/add",
        element: <AddTransaction />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/add",
        element: <AddUser />,
      },
    ],
  },
  {
    path: "*",
    loader: () => {
      window.location.href = '/';
      return null;
    },
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App

