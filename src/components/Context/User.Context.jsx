import { createContext, useState } from "react";

export  const UserContext =  createContext (null)

export default function UserProvider({children}){

    const [token,setToken]=useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('Role'));

    function logOut() {
        localStorage.removeItem('token')
        localStorage.removeItem("Role")
        setToken(null)
        setRole(null)
    }
    
    return <UserContext.Provider value={{ token, setToken, role, setRole, logOut }}>
        {children}
    </UserContext.Provider>
}