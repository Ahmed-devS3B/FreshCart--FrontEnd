import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../components/Context/User.Context";


export default function AdminLogin() {
    const [incorrectCredsError, setIncorrectCredsError] = useState(null)

    const navigate = useNavigate()
    
    // Get token and role setter from UserContext
    let { setToken, setRole } = useContext(UserContext)

    function handleLogin(values) {
        const toastLoadingID = toast.loading("Authenticating")
        
        try {
            if (values.email === 'admin@marketplace.com' && values.password === 'Admin123!') {
                // Set admin role in localStorage and context
                localStorage.setItem('Role', 'Admin');
                setRole('Admin');
                
                toast.success('Welcome Admin')
            } else {
                throw new Error('Invalid credentials')
            }
        } catch (error) {
            toast.error('Invalid username or password')
            setIncorrectCredsError('Invalid username or password')
        } finally {
            toast.dismiss(toastLoadingID)
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: handleLogin,
    })

    return (
        <div className="flex justify-center items-center w-full">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
                <div className="flex justify-center mb-4 border-b">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="px-4 py-2 text-slate-600 hover:text-primary-700"
                    >
                        Customer
                    </button>
                    <button 
                        onClick={() => navigate('/vendor-login')} 
                        className="px-4 py-2 text-slate-600 hover:text-primary-700"
                    >
                        Vendor
                    </button>
                    <button 
                        className="px-4 py-2 text-primary-700 border-b-2 border-primary-700 font-medium"
                    >
                        Admin
                    </button>
                </div>
                <h1 className="text-xl md:text-2xl text-slate-700 font-semibold mb-5 text-center sm:text-left">
                    <i className="fa-solid fa-user-tie mr-2"></i>Admin Log In
                </h1>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div className="username">
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="text" 
                            id="email"
                            className="form-control w-full" 
                            placeholder="Email Address" 
                            value={formik.values.email} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            name="email" 
                        />
                    </div>

                    <div className="password">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            className="form-control w-full" 
                            placeholder="Password" 
                            value={formik.values.password} 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            name="password" 
                        />
                        {incorrectCredsError && (
                            <p className="text-red-500 mt-1 text-sm">*{incorrectCredsError}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="btn w-full bg-primary-700 hover:bg-primary-800 text-white py-2 text-base font-medium transition-all duration-200 ease-in-out"
                        >
                            Log In as Admin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
