import axios from "axios"
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { cartContext } from "../../components/Context/Cart.Context";
import { UserContext } from "../../components/Context/User.Context";
import toast from "react-hot-toast";
import useOnline from "../../hooks/useOnline";
import { Helmet } from "react-helmet";


export default function ProductDetails() {

    let isOnline = useOnline()

    const [productDetails, setProductDetails] = useState(null)
    const [quantity, setQuantity] = useState(0) // Added quantity state
    let { id } = useParams() //to take the id from the url

    const { addProductToCart } = useContext(cartContext)
    const { token } = useContext(UserContext)
    const navigate = useNavigate()

    //Get product details function
    async function getProductDetails() {
        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Customer/products/${id}`,
                method: 'GET'
            }
            let { data } = await axios.request(options)
            setProductDetails(data)
        } catch (error) {
            console.error("Error fetching product details:", error)
        }
    }

    useEffect(() => {
        getProductDetails();
    }, [id]); // Add id as a dependency so it refreshes when id changes

    // Function to handle adding to cart
    const handleAddToCart = () => {
        if (!token) {
            toast.error("Please login first to add items to your cart.")
            navigate('/login')
            return;
        }
        addProductToCart({ productId: id, quantity: quantity  })
    }

    // Function to handle quantity change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value)
        if (value >= 0 && value <= productDetails.numberOfAvailableUnits) {
            setQuantity(value)
        }
    }

    // Function to increment quantity
    const incrementQuantity = () => {
        if (quantity < productDetails.numberOfAvailableUnits) {
            setQuantity(quantity + 1)
        }
    }

    // Function to decrement quantity
    const decrementQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1)
        }
    }

    return <>
        <Helmet>
            <title>Product Details</title>
        </Helmet>

        {productDetails ? (
            <>
                <Helmet>
                    <title>{productDetails.title}</title>
                </Helmet>
                <section className=" grid grid-cols-12 gap-12 ">
                    <div className="col-span-3">
                        <img src={productDetails.images} alt="" className="w-full" />
                    </div>
                    <div className="col-span-9 space-y-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-600">{productDetails.title}</h2>
                            <h3 className="text-primary-600 font-semibold">{productDetails.category}</h3>
                        </div>
                        <p className="text-gray-400">{productDetails.description}</p>

                        {/* Enhanced product details section */}
                        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Price */}
                                <div className="bg-primary-50 rounded-lg p-3 flex items-center transform transition-transform hover:scale-105">
                                    <div className="bg-primary-100 rounded-full p-2 mr-3 flex items-center justify-center w-10 h-10">
                                        <i className="fa-solid fa-tag text-primary-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Price</p>
                                        <p className="text-xl font-bold text-primary-700">{productDetails.price} L.E</p>
                                    </div>
                                </div>
                                
                                {/* Available Units */}
                                <div className="bg-green-50 rounded-lg p-3 flex items-center transform transition-transform hover:scale-105">
                                    <div className="bg-green-100 rounded-full p-2 mr-3 flex items-center justify-center w-10 h-10">
                                        <i className="fa-solid fa-box text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Available</p>
                                        <p className="text-xl font-bold text-green-700">{productDetails.numberOfAvailableUnits} pieces</p>
                                    </div>
                                </div>
                                
                                {/* Store Name */}
                                <div className="bg-blue-50 rounded-lg p-3 flex items-center transform transition-transform hover:scale-105">
                                    <div className="bg-blue-100 rounded-full p-2 mr-3 flex items-center justify-center w-10 h-10">
                                        <i className="fa-solid fa-shop text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Store Name</p>
                                        <p className="text-xl font-bold text-blue-700">{productDetails.storeName}</p>
                                    </div>
                                </div>
                                
                                {/* Views */}
                                <div className="bg-amber-50 rounded-lg p-3 flex items-center transform transition-transform hover:scale-105">
                                    <div className="bg-amber-100 rounded-full p-2 mr-3 flex items-center justify-center w-10 h-10">
                                        <i className="fa-solid fa-eye text-amber-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Views</p>
                                        <p className="text-xl font-bold text-amber-700">{productDetails.numberOfViewers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity selector */}
                        {productDetails.numberOfAvailableUnits > 0 && (
                            <div className="flex items-center space-x-4 mt-4">
                                <span className="text-gray-700 font-medium">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button 
                                        onClick={decrementQuantity}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                    <input 
                                        type="number" 
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="w-12 text-center border-0 focus:ring-0"
                                        min="0"
                                        max={productDetails.numberOfAvailableUnits}
                                    />
                                    <button 
                                        onClick={incrementQuantity}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {isOnline && 
                            <button 
                                onClick={handleAddToCart}
                                disabled={productDetails.numberOfAvailableUnits <= 0 || quantity === 0}
                                className={`btn ${productDetails.numberOfAvailableUnits > 0 && quantity > 0
                                    ? 'bg-primary-500 hover:bg-primary-600 transform hover:scale-105' 
                                    : 'bg-gray-400 cursor-not-allowed'} 
                                    text-white font-semibold w-full mt-4 py-3 rounded-lg transition-all duration-300`}
                            > 
                                {productDetails.numberOfAvailableUnits > 0 
                                    ? <><i className="fa-solid fa-cart-plus mr-2"></i>Add To Cart</> 
                                    : <><i className="fa-solid fa-ban mr-2"></i>Out of Stock</>}
                            </button>
                        }
                    </div>
                </section>
            </>
        )
            :
            <Loading />}
    </>
}
