import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { object, ref, string } from 'yup'
import axios from 'axios';
import { useState } from "react";
import toast from "react-hot-toast";

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

    return <>
        <div className="flex justify-center items-center w-full">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
                <h1 className="text-xl md:text-2xl text-slate-700 font-semibold mb-5 text-center sm:text-left">
                    <i className="fa-solid fa-store mr-2"></i>Vendor Registration
                </h1>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>

                    <div className="storeName">
                        <label htmlFor="storeName" className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                        <input
                            type="text"
                            id="storeName"
                            className="form-control w-full"
                            placeholder="Enter Your Store Name"
                            value={formik.values.storeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="storeName"
                        />
                        {formik.errors.storeName && formik.touched.storeName && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.storeName}</p>
                        )}
                    </div>

                    <div className="ownerName">
                        <label htmlFor="ownerName" className="block text-sm font-medium text-slate-700 mb-1">Owner Name</label>
                        <input
                            type="text"
                            id="ownerName"
                            className="form-control w-full"
                            placeholder="Enter Owner's Full Name"
                            value={formik.values.ownerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="ownerName"
                        />
                        {formik.errors.ownerName && formik.touched.ownerName && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.ownerName}</p>
                        )}
                    </div>

                    <div className="email">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Business Email</label>
                        <input
                            type="email"
                            id="businessEmail"
                            className="form-control w-full"
                            placeholder="Business Email Address"
                            value={formik.values.businessEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="businessEmail"
                        />
                        {formik.errors.businessEmail && formik.touched.businessEmail && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.businessEmail}</p>
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
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="password"
                        />
                        {formik.errors.password && formik.touched.password && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.password}</p>
                        )}
                    </div>

                    <div className="rePassword">
                        <label htmlFor="rePassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control w-full"
                            placeholder="Confirm Password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="confirmPassword"
                        />
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="phone">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="form-control w-full"
                            placeholder="Business Phone Number"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="phoneNumber"
                        />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.phoneNumber}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="btn w-full bg-primary-700 hover:bg-primary-800 text-white py-2 text-base font-medium transition-all duration-200 ease-in-out"
                        >
                            Register as Vendor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}
