import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { UserContext } from "../Context/User.Context"

export default function ProtectedRoute({ children }) {
    let { token, role } = useContext(UserContext)
    
    const currentToken = token || localStorage.getItem('token')
    const currentRole = role || localStorage.getItem('Role')

    // Authenticated if token exists OR user is Admin
    if (!currentToken && currentRole !== 'Admin') {
        return <Navigate to='/login' />
    }

    // If children is provided, render them, otherwise render Outlet for nested routes
    return children ? children : <Outlet />
}
