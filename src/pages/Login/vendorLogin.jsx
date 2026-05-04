import { useFormik } from "formik"
import { useNavigate } from "react-router-dom";
import { object, string } from 'yup'
import axios from 'axios';
import { useState } from "react";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../../components/Context/User.Context";

export default function VendorLogin() {

    let { setToken, setRole } = useContext(UserContext)

    const [incorrectEmailPasswordError, setIncorrectEmailPasswordError] = useState(null)

    //navigation function 
    const navigate = useNavigate()

    //regex for password validation
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    //custom validations
    const validationSchema = object({
        email: string().required('Email is required').email("Email is Invalid"),
        password: string().required('Password is Required').matches(passwordRegex, 'Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
    })

    //vendor Login Api
    async function sendDataToLogin(values) {
        //notifications
        const toastLoadingID = toast.loading("Waiting")
        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Auth/login/vendor`, 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: values
            }


            let { data } = await axios.request(options);
            if (data.role === 'Vendor') {

                  //setting the role for the vcustomer
                  localStorage.setItem('Role', data.role);
                  setRole(data.role);

                  //setting the role for the vendor
                localStorage.setItem('token', data.accessToken)
                setToken(data.accessToken)
                toast.success('Welcome Back Vendor')
            }

        }
        catch (error) {
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
            email: '',
            password: '',
        },
        //the key and the value are the same name.
        validationSchema,

        //the api to send data to backend when submitting the form.
        onSubmit: sendDataToLogin,
    })

    return <>
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
                        className="px-4 py-2 text-primary-700 border-b-2 border-primary-700 font-medium"
                    >
                        Vendor
                    </button>
                    <button
                        onClick={() => navigate('/admin-login')}
                        className="px-4 py-2 text-slate-600 hover:text-primary-700"
                    >
                        Admin
                    </button>
                </div>
                <h1 className="text-xl md:text-2xl text-slate-700 font-semibold mb-5 text-center sm:text-left">
                    <i className="fa-solid fa-shop mr-2"></i>Vendor Log In
                </h1>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div className="email">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control w-full"
                            placeholder="Email Address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="email"
                        />
                        {formik.errors.email && formik.touched.email && (
                            <p className="text-red-500 mt-1 text-sm">*{formik.errors.email}</p>
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
                        {incorrectEmailPasswordError && (
                            <p className="text-red-500 mt-1 text-sm">*{incorrectEmailPasswordError}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="btn w-full bg-primary-700 hover:bg-primary-800 text-white py-2 text-base font-medium transition-all duration-200 ease-in-out"
                        >
                            Log In as Vendor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
}
