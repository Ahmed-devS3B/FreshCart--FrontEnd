import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../components/Context/User.Context";
import { Helmet } from "react-helmet";


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
        <>
            <Helmet>
                <title>Admin Login | FreshCart</title>
            </Helmet>
            <div className="flex justify-center items-center w-full py-12 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto border border-slate-100 dark:border-slate-700">
                    {/* Role Selection Tabs */}
                    <div className="flex justify-center mb-8 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                            Customer
                        </button>
                        <button 
                            onClick={() => navigate('/vendor-login')} 
                            className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                            Vendor
                        </button>
                        <button 
                            className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm"
                        >
                            Admin
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-user-tie text-3xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Log In</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">System administration access</p>
                    </div>

                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                                <input 
                                    type="text" 
                                    id="email"
                                    name="email"
                                    className="form-control w-full pl-10 py-3 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                                    placeholder="Email Address" 
                                    value={formik.values.email} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur} 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password"
                                    className="form-control w-full pl-10 py-3 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                                    placeholder="Password" 
                                    value={formik.values.password} 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur} 
                                />
                            </div>
                            {incorrectCredsError && (
                                <p className="text-red-500 text-xs font-medium pl-1">{incorrectCredsError}</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform active:scale-[0.98]"
                            >
                                Log In
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-500">
                            Restricted area. Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
