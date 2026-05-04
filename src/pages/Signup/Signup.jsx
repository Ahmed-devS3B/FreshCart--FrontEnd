import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { object, ref, string } from 'yup'
import axios from 'axios';
import { useState } from "react";
import toast from "react-hot-toast";



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

    return <>
        <div className="flex justify-center items-center w-full">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
                <h1 className="text-xl md:text-2xl text-slate-700 font-semibold mb-5 text-center sm:text-left">
                    <i className="fa-regular fa-circle-user mr-2"></i>Customer Registration
                </h1>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>

                    <div className="name">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control w-full"
                            placeholder="Type Your Name"
                            value={formik.values.FullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="FullName"
                        />
                        {formik.errors.FullName && formik.touched.FullName && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.FullName}</p>
                        )}
                    </div>

                    <div className="email">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control w-full"
                            placeholder="Email Address"
                            value={formik.values.Email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="Email"
                        />
                        {formik.errors.Email && formik.touched.Email && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.Email}</p>
                        )}
                        {accountExistError && (
                            <p className="text-red-500 mt-1 text-sm">*{accountExistError}</p>
                        )}
                    </div>

                    <div className="password">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control w-full"
                            placeholder="Password"
                            value={formik.values.PasswordHash}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="PasswordHash"
                        />
                        {formik.errors.PasswordHash && formik.touched.PasswordHash && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.PasswordHash}</p>
                        )}
                    </div>

                    <div className="rePassword">
                        <label htmlFor="rePassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="rePassword"
                            className="form-control w-full"
                            placeholder="Confirm Password"
                            value={formik.values.ConfirmPasswordHash}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="ConfirmPasswordHash"
                        />
                        {formik.errors.ConfirmPasswordHash && formik.touched.ConfirmPasswordHash && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.ConfirmPasswordHash}</p>
                        )}
                    </div>

                    <div className="phone">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            className="form-control w-full"
                            placeholder="Phone Number"
                            value={formik.values.PhoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="PhoneNumber"
                        />
                        {formik.errors.PhoneNumber && formik.touched.PhoneNumber && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.PhoneNumber}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="btn w-full bg-primary-700 hover:bg-primary-800 text-white py-2 text-base font-medium transition-all duration-200 ease-in-out"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-600 mb-2">Are you a business owner?</p>
                    <button
                        onClick={() => navigate('/vendor-signup')}
                        className="btn w-full border border-primary-700 text-primary-700 hover:bg-primary-50 py-2 text-base font-medium transition-all duration-200 ease-in-out"
                    >
                        Register as Vendor
                    </button>
                </div>
            </div>
        </div>






    </>
}

