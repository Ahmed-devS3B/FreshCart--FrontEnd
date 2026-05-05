import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { object, ref, string } from 'yup'
import axios from 'axios';
import { useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";



export default function Signup() {

    //navigation function 
    const navigate = useNavigate()
    //state for existing accounts
    const [accountExistError, setAccountExistError] = useState(null)


    //regex for password validation
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    //regex for phone
    const phoneRegex = /^(02)?01[0125][0-9]{8}$/


    //custom validations
    const validationSchema = object({
        FullName: string()
            .required('Name Is Required')
            .min(3, 'Name Must Be At least 3 Characters')
            .max(25, "Name Can't be more than 25 characters"),
        Email: string()
            .required('Email is required')
            .email("Email is Invalid"),
          
        PasswordHash: string()
            .required('Password is Required')
            .matches(passwordRegex, 'Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
        ConfirmPasswordHash: string()
            .required("Confirm Password is required")
            .oneOf([ref("PasswordHash")], 'Password and Confirm password should be the same'),
        PhoneNumber: string()
            .required("Phone number is required")
            .matches(phoneRegex, 'Sorry, We accept Egyptian Phone Numbers Only ')
    })

    //customer register api
    async function sendDataToRegister(values) {
        const toastLoadingID = toast.loading("Creating your account...")

        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Auth/register/customer`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    FullName: values.FullName,
                    Email: values.Email,
                    Password: values.PasswordHash,
                    ConfirmPassword: values.ConfirmPasswordHash,
                    PhoneNumber: values.PhoneNumber
                }
            }

            let { data } = await axios.request(options);

            if (data.message === "Customer registered successfully.") {
                toast.success("Customer Account Created Successfully.");
                setTimeout(() => {
                    navigate("/login")
                }, 2000)
            }
        }
        catch (error) {
            toast.error(error.response.data.message);
            setAccountExistError(error.response.data.message);
            // console.log(error.response.data.message);  
        }
        finally {
            toast.dismiss(toastLoadingID);
        }
    }


    //custom form
    const formik = useFormik({
        initialValues: {
            FullName: '',
            Email: '',
            PasswordHash: '',
            ConfirmPasswordHash: '',
            PhoneNumber: ''
        },
        validationSchema,
        onSubmit: sendDataToRegister,
    })

    return (
        <>
            <Helmet>
                <title>Customer Registration | FreshCart</title>
            </Helmet>
            <div className="flex justify-center items-center w-full py-12 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto border border-slate-100 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-regular fa-circle-user text-3xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Customer Registration</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Create your account to start shopping</p>
                    </div>

                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-user"></i>
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Type Your Name"
                                    value={formik.values.FullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="FullName"
                                />
                            </div>
                            {formik.errors.FullName && formik.touched.FullName && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.FullName}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Email Address"
                                    value={formik.values.Email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="Email"
                                />
                            </div>
                            {formik.errors.Email && formik.touched.Email && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.Email}</p>
                            )}
                            {accountExistError && (
                                <p className="text-red-500 text-xs font-medium pl-1">{accountExistError}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <i className="fa-solid fa-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        placeholder="Password"
                                        value={formik.values.PasswordHash}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="PasswordHash"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="rePassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                        <i className="fa-solid fa-shield-check"></i>
                                    </span>
                                    <input
                                        type="password"
                                        id="rePassword"
                                        className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        placeholder="Confirm"
                                        value={formik.values.ConfirmPasswordHash}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        name="ConfirmPasswordHash"
                                    />
                                </div>
                            </div>
                        </div>
                        {(formik.errors.PasswordHash && formik.touched.PasswordHash) || (formik.errors.ConfirmPasswordHash && formik.touched.ConfirmPasswordHash) ? (
                            <p className="text-red-500 text-xs font-medium pl-1">
                                {formik.errors.PasswordHash || formik.errors.ConfirmPasswordHash}
                            </p>
                        ) : null}

                        <div className="space-y-1">
                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Phone Number"
                                    value={formik.values.PhoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="PhoneNumber"
                                />
                            </div>
                            {formik.errors.PhoneNumber && formik.touched.PhoneNumber && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.PhoneNumber}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform active:scale-[0.98]"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">Are you a business owner?</p>
                        <button
                            onClick={() => navigate('/vendor-signup')}
                            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 py-3 rounded-xl text-base font-bold transition-all duration-300 transform active:scale-[0.98]"
                        >
                            Register as Vendor
                        </button>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account? <button onClick={() => navigate('/login')} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Log In</button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

