import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { object, ref, string } from 'yup'
import axios from 'axios';
import { useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

export default function VendorSignup() {
    //navigation function 
    const navigate = useNavigate()
    //state for existing accounts
    const [accountExistError, setAccountExistError] = useState(null)

    //regex for password validation
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    //regex for phone
    const phoneRegex = /^(02)?01[0125][0-9]{8}$/

    //custom validations
    const validationSchemaVendor = object({
        storeName: string().required('Store Name Is Required').min(3, 'Store Name Must Be At least 3 Characters').max(50, "Store Name Can't be more than 50 characters"),
        ownerName: string().required('Owner Name Is Required').min(3, 'Owner Name Must Be At least 3 Characters').max(25, "Owner Name Can't be more than 25 characters"),
        businessEmail: string().required('Email is required').email("Email is Invalid"), // Changed from email to businessEmail
        password: string().required('Password is Required').matches(passwordRegex, 'Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
        confirmPassword: string().required("Confirm Password is required").oneOf([ref("password")], 'Password and Confirm password should be the same'), // Changed from rePassword to confirmPassword
        phoneNumber: string().required("Phone number is required").matches(phoneRegex, 'Sorry, We accept Egyptian Phone Numbers Only '), // Changed from phone to phoneNumber
    })

    //vendor register api
    async function sendDataToRegisterVendor(values) {
        //notifications
        const toastLoadingID = toast.loading("Waiting")

        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Auth/register/vendor`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: values
            }
            console.log(options);



            let { data } = await axios.request(options);
            if (data.message === "Vendor registered successfully.") {
                toast.success("Vendor Account Created Successfully.");
                setTimeout(() => {
                    navigate("/vendor-login")
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
        //varNames must be same as in database and backend.
        initialValues: {
            storeName: '',
            ownerName: '',
            businessEmail: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
        },
        //the key and the value are the same name.
        validationSchemaVendor,

        //the api to send data to backend when submitting the form.
        onSubmit: sendDataToRegisterVendor,
    })

    return (
        <>
            <Helmet>
                <title>Vendor Registration | FreshCart</title>
            </Helmet>
            <div className="flex justify-center items-center w-full py-12 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto border border-slate-100 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fa-solid fa-store text-3xl text-primary-600 dark:text-primary-400"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Vendor Registration</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Register your store and start selling</p>
                    </div>

                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="storeName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Store Name</label>
                                <input
                                    type="text"
                                    id="storeName"
                                    className="form-control w-full py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Store Name"
                                    value={formik.values.storeName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="storeName"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="ownerName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Owner Name</label>
                                <input
                                    type="text"
                                    id="ownerName"
                                    className="form-control w-full py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Owner Name"
                                    value={formik.values.ownerName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="ownerName"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {formik.errors.storeName && formik.touched.storeName && (
                                <p className="text-red-500 text-[10px] font-medium flex-1">{formik.errors.storeName}</p>
                            )}
                            {formik.errors.ownerName && formik.touched.ownerName && (
                                <p className="text-red-500 text-[10px] font-medium flex-1">{formik.errors.ownerName}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="businessEmail" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Business Email</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    id="businessEmail"
                                    className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="business@example.com"
                                    value={formik.values.businessEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="businessEmail"
                                />
                            </div>
                            {formik.errors.businessEmail && formik.touched.businessEmail && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.businessEmail}</p>
                            )}
                            {accountExistError && (
                                <p className="text-red-500 text-xs font-medium pl-1">{accountExistError}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control w-full py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="password"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control w-full py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Confirm"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="confirmPassword"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {formik.errors.password && formik.touched.password && (
                                <p className="text-red-500 text-[10px] font-medium flex-1">{formik.errors.password}</p>
                            )}
                            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                <p className="text-red-500 text-[10px] font-medium flex-1">{formik.errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="form-control w-full pl-10 py-2.5 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                    placeholder="Phone Number"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="phoneNumber"
                                />
                            </div>
                            {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                                <p className="text-red-500 text-xs font-medium pl-1">{formik.errors.phoneNumber}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform active:scale-[0.98]"
                            >
                                Register Store
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-500">
                            Already have a vendor account? <button onClick={() => navigate('/vendor-login')} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Log In</button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
