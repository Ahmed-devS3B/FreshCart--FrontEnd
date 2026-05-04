import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from "./pages/Signup/Signup"
import VendorSignup from "./pages/Signup/vendorSignup"
import Login from "./pages/Login/Login"
import VendorLogin from "./pages/Login/vendorLogin"
import AdminLogin from "./pages/Login/adminLogin"
import Home from "./pages/Home/Home"
import Layout from "./components/Layout/Layout"
import AdminLayout from "./components/Layout/AdminLayout"
import { Toaster } from "react-hot-toast"

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import VendorProtectedRoute from "./components/ProtectedRoute/VendorProtectedRoute"
import AdminProtectedRoute from "./components/ProtectedRoute/AdminProtectedRoute"

import GuestRoute from "./components/GuestRoute/GuestRoute"
import UserProvider from "./components/Context/User.Context"
import CartProvider from "./components/Context/Cart.Context"
import Cart from "./pages/Cart/Cart"
import ProductDetails from "./pages/ProductDetails/ProductDetails"
import Checkout from "./pages/Checkout/Checkout"
import Orders from "./pages/Orders/Orders"
import Offline from "./components/Offline/Offline"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ProductSearch from "./pages/ProductSearch/ProductSearch"
import Wishlist from "./pages/Wishlist/Wishlist"
import WishlistProvider from "./components/Context/Wishlist.Context"

// import an admin dashboared component 
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminVendors from "./pages/Admin/Vendors";
import AdminProducts from "./pages/Admin/Products";
import VendorDashboard from "./pages/VendorDashboard"
import Unauthorized from "./pages/Unauthorized/Unauthorized"
import { NotificationProvider } from "./components/Context/Notification.Context"
function App() {
  //create an object of routes and pass it to the routerprovider
  const routesList = createBrowserRouter([
    { //public routes that don't require login
      path: '/', element: <Layout />, children: [
        { index: true, element: <Home /> }, //the default page 
        { path: 'product', element: <ProductDetails /> },
        { path: 'product/:id', element: <ProductDetails /> }, //send the id of the product as a params to the url
        { path: 'search', element: <ProductSearch /> }, //  search page
        { path: 'wishlist', element: <Wishlist /> }, // Added wishlist route
        // { path: 'vendor/dashboard', element: <VendorDashboard /> }, 
      ]
    },
    { path: '/unauthorized', element: <Unauthorized /> },
    {
      path: '/vendor', element: (<VendorProtectedRoute> <VendorDashboard /> </VendorProtectedRoute>), children: []
    },
    { //protected routes with checking logged in or not 
      path: '/', element: (<ProtectedRoute> <Layout /> </ProtectedRoute>), children: [
        { path: 'cart', element: <Cart /> },
        { path: 'checkout', element: <Checkout /> },
        { path: 'allorders', element: <Orders /> } // the path is taken from the backend 'allorders' may be changed
      ]
    },

    { // admin routes with admin layout
      path: '/admin', element: (<AdminProtectedRoute> <AdminLayout /> </AdminProtectedRoute>), children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'vendors', element: <AdminVendors /> },
        { path: 'products', element: <AdminProducts /> }
      ]
    },

    { // guest routes for non-logged in users
      path: '/', element: (<GuestRoute> <Layout /> </GuestRoute>), children: [
        { path: '/signup', element: <Signup /> },
        { path: '/vendor-signup', element: <VendorSignup /> },
        { path: 'login', element: <Login /> },
        { path: 'vendor-login', element: <VendorLogin /> },
        { path: 'admin-login', element: <AdminLogin /> },
      ]
    }
  ])

  //query client for react query
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient} >
          <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <RouterProvider router={routesList} />
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
       
        <Toaster position="top-right" />

        <Offline>
          <div className="p-4 rounded-lg bg-gray-200 shadow text-gray-600 font-semibold fixed bottom-8 right-8 z-50">
            <span> 🛜 Check your Internet connection </span>
          </div>
        </Offline>
      </QueryClientProvider>
    </>
  )
}

export default App