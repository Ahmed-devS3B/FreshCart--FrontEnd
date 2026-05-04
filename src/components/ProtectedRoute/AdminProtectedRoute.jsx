import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Context/User.Context';

export default function AdminProtectedRoute({ children }) {
  const { token, role } = useContext(UserContext);
  
  const currentToken = token || localStorage.getItem('token');
  const currentRole = role || localStorage.getItem('Role');
  
  // Admin is authenticated by Role alone if token is missing
  if (currentRole === 'Admin') {
    return children;
  }
  
  if (!currentToken) {
    return <Navigate to="/admin-login" replace />;
  }
  
  // Redirect to unauthorized page if not an admin
  return <Navigate to="/unauthorized" replace />;
}
