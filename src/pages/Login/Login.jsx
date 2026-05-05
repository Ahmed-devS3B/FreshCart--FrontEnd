import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { object, ref, string } from 'yup'
import axios from 'axios';
import { useState } from "react";
import toast from "react-hot-toast";
import {  UserContext } from "../../components/Context/User.Context";
import { useContext } from "react";
import { Helmet } from "react-helmet";



export default function Login() {

    const [incorrectEmailPasswordError, setIncorrectEmailPasswordError] = useState(null)

    //navigation function 
    const navigate = useNavigate()

    //the token of the user
    let {setToken, setRole} =  useContext(UserContext)

    //regex for password validation
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    //custom validations
    const validationSchema = object({
        Email: string()
            .required('Email is required')
            .email("Email is Invalid")
            .test(
                "is-marketplace",
                "Email must end with @marketplace.com.",
                (value) => value && value.endsWith("@marketplace.com")
            ),
        Password: string().required('Password is Required').matches(passwordRegex, 'Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),

    })

    //customer login api
    async function sendDataToLogin(values) {

        //notifications
        const toastLoadingID = toast.loading("Waiting")

        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Auth/login/customer`,
                method: 'POST',
                data: values
            }

            let { data } = await axios.request(options);
            console.log("Login API response:", data);

            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('Role', 'Customer');
                setToken(data.accessToken);
                setRole('Customer');
                toast.success('Welcome Back');
            } else {
                toast.error('Login failed');
            }

        }
        catch (error) {
            console.log("Login error:", error);
            toast.error(error.response.data.message)
            setIncorrectEmailPasswordError(error.response.data.message)
        }
        finally {
            toast.dismiss(toastLoadingID);
        }

    }


    //custom form
    const formik = useFormik({
        //varNames must be same as in database and backend.
        initialValues: {
            Email: '',
            Password: '',
        },
        //the key and the value are the same name.
        validationSchema,

        //the api to send data to backend when submitting the form.
        onSubmit: sendDataToLogin,
    })

    return (
        <>
            <Helmet>
                <title>Customer Login | FreshCart</title>
            </Helmet>
            <div className="flex justify-center items-center w-full py-12 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto border border-slate-100 dark:border-slate-700">
                    {/* Role Selection Tabs */}
                    <div className="flex justify-center mb-8 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
                        <button 
                            className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm"
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
                            onClick={() => navigate('/admin-login')} 
                            className="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                            Admin
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-regular fa-circle-user text-3xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Customer Log In</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Welcome back! Please enter your details</p>
                    </div>

                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="Email"
                                    className="form-control w-full pl-10 py-3 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                                    placeholder="Email Address" 
                                    value={formik.values.Email} 
                                    onChange={formik.handleChange}      
                                    onBlur={formik.handleBlur} 
                                />
                            </div>
                            {formik.errors.Email && formik.touched.Email && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.Email}</p>
                            )}
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
                                    name="Password"
                                    className="form-control w-full pl-10 py-3 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                                    placeholder="Password" 
                                    value={formik.values.Password}      
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur} 
                                />
                            </div>
                            {formik.errors.Password && formik.touched.Password && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.Password}</p>
                            )}
                            {incorrectEmailPasswordError && (
                                <p className="text-red-500 text-xs font-medium pl-1">{incorrectEmailPasswordError}</p>
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
                            Don't have an account? <button onClick={() => navigate('/signup')} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign Up</button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

}


