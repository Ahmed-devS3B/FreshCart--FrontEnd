import { useFormik } from "formik";
import { useContext } from "react";
import { cartContext } from "../../components/Context/Cart.Context";
import { UserContext } from "../../components/Context/User.Context";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function Checkout() {
  const { cartInfo, clearCart } = useContext(cartContext);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCashOrder(values) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    let toastId = toast.loading("Processing your Order...");

    try {
      const apiData = {
        Address: values.Address,
        phoneNumber: values.phoneNumber,
        comment: values.comment
      };

      const options = {
        url: `${import.meta.env.VITE_API_URL}/Customer/checkout`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: apiData,
      };

      let { data } = await axios.request(options);
      if (data.message) {
        toast.success(data.message);
        await clearCart(); // Ensure cart is cleared
        setTimeout(() => {
          navigate("/allOrders");
        }, 2000);
      } else {
        toast.error("Unexpected response. Try again.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong! Please try again."
      );
    } finally {
      toast.dismiss(toastId);
      setIsSubmitting(false);
    }
  }

  const validationSchema = Yup.object({
    Address: Yup.string().required("Address is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    comment: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      Address: "",
      phoneNumber: "",
      comment: ""
    },
    validationSchema,
    onSubmit: (values) => {
      handleCashOrder(values);
    },
  });

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Checkout
          </h1>

          {cartInfo?.products?.length > 0 ? (
            <>
              <section>
                <h2 className="text-lg text-gray-700 font-semibold mb-4">
                  Shipping Information
                </h2>
                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                  <div className="Address">
                    <label htmlFor="Address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      id="Address"
                      type="text"
                      className={`form-control w-full p-2 border rounded-md ${
                        formik.touched.Address && formik.errors.Address
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your full Address"
                      value={formik.values.Address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="Address"
                    />
                    {formik.touched.Address && formik.errors.Address && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.Address}</div>
                    )}
                  </div>

                  <div className="phoneNumber">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      className={`form-control w-full p-2 border rounded-md ${
                        formik.touched.phoneNumber && formik.errors.phoneNumber
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="phoneNumber"
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNumber}</div>
                    )}
                  </div>

                  <div className="comment">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Comments (Optional)
                    </label>
                    <textarea
                      id="comment"
                      className="form-control w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Any special instructions or comments about your order"
                      value={formik.values.comment}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="comment"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className={`btn ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold px-6 py-2 rounded`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Place Cash Order'}
                    </button>
                  </div>
                </form>
              </section>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}