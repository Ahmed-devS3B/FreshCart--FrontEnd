import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Context/User.Context';

export default function VendorProtectedRoute({ children }) {
  const { token, role } = useContext(UserContext);
  
  const currentToken = token || localStorage.getItem('token');
  const currentRole = role || localStorage.getItem('Role');
  
  if (!currentToken) {
    return <Navigate to="/vendor-login" replace />;
  }
  
  if (currentRole !== 'Vendor') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}