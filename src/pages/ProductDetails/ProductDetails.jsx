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

    return (
        <>
            <Helmet>
                <title>Product Details</title>
            </Helmet>

            {productDetails ? (
                <>
                    <Helmet>
                        <title>{productDetails.title}</title>
                    </Helmet>
                    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                        {/* Product Image */}
                        <div className="col-span-1 md:col-span-4 lg:col-span-3">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700 transition-all duration-300">
                                <img 
                                    src={productDetails.images} 
                                    alt={productDetails.title} 
                                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500 p-4" 
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="col-span-1 md:col-span-8 lg:col-span-9 space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{productDetails.title}</h1>
                                <div className="flex items-center space-x-2">
                                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold rounded-full">
                                        {productDetails.category}
                                    </span>
                                </div>
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                                    {productDetails.description}
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Price Card */}
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-all group">
                                    <div className="bg-primary-100 dark:bg-primary-900/40 rounded-lg p-3 mr-4 flex items-center justify-center w-12 h-12 group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-tag text-primary-600 dark:text-primary-400 text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Price</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{productDetails.price} <span className="text-sm font-medium">L.E</span></p>
                                    </div>
                                </div>
                                
                                {/* Available Card */}
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-all group">
                                    <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-3 mr-4 flex items-center justify-center w-12 h-12 group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-box-open text-green-600 dark:text-green-400 text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Available</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{productDetails.numberOfAvailableUnits} <span className="text-sm font-medium text-slate-500">pieces</span></p>
                                    </div>
                                </div>
                                
                                {/* Store Card */}
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-all group">
                                    <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3 mr-4 flex items-center justify-center w-12 h-12 group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-store text-blue-600 dark:text-blue-400 text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Store Name</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">{productDetails.storeName}</p>
                                    </div>
                                </div>
                                
                                {/* Views Card */}
                                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex items-center shadow-sm hover:shadow-md transition-all group">
                                    <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-3 mr-4 flex items-center justify-center w-12 h-12 group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-eye text-amber-600 dark:text-amber-400 text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Views</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{productDetails.numberOfViewers}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 space-y-6">
                                {productDetails.numberOfAvailableUnits > 0 && (
                                    <div className="flex items-center space-x-6">
                                        <span className="text-slate-700 dark:text-slate-300 font-semibold">Quantity:</span>
                                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
                                            <button 
                                                onClick={decrementQuantity}
                                                className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <input 
                                                type="number" 
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="w-16 h-12 text-center bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 font-bold text-lg"
                                                min="0"
                                                max={productDetails.numberOfAvailableUnits}
                                            />
                                            <button 
                                                onClick={incrementQuantity}
                                                className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isOnline && (
                                    <button 
                                        onClick={handleAddToCart}
                                        disabled={productDetails.numberOfAvailableUnits <= 0 || quantity === 0}
                                        className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center space-x-3
                                            ${productDetails.numberOfAvailableUnits > 0 && quantity > 0
                                                ? 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-primary-500/30' 
                                                : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'}`}
                                    > 
                                        {productDetails.numberOfAvailableUnits > 0 
                                            ? <><i className="fa-solid fa-cart-plus text-xl"></i><span>Add To Cart</span></> 
                                            : <><i className="fa-solid fa-ban text-xl"></i><span>Out of Stock</span></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <Loading />
            )}
        </>
    );
}
