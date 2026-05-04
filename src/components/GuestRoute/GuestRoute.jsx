import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../Context/User.Context"

export default function GuestRoute({children}) {
   
   let { token, role } = useContext(UserContext)
   
   // Use localStorage as a fallback to avoid race conditions during login
   const currentToken = token || localStorage.getItem('token');
   const currentRole = role || localStorage.getItem('Role');

    // User is logged in if they have a token OR if they are an Admin (who has no token)
    const isLoggedIn = currentToken || currentRole === 'Admin';

    if (!isLoggedIn){
        return children;
    }
    else {
        // Redirect based on role
        if (currentRole === 'Admin') {
            return <Navigate to='/admin' replace />
        } else if (currentRole === 'Vendor') {
            return <Navigate to='/vendor' replace />
        }
        return <Navigate to='/' replace />
    }
}
