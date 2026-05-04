import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../components/Context/User.Context"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import Loading from "../../components/Loading/Loading"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

export default function Orders() {
    const [orders, setOrders] = useState(null)
    const [activeOrder, setActiveOrder] = useState(null)
    const { token } = useContext(UserContext)

    
    // Get user orders function
    async function getUserOrders() {
        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Customer/orders`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            let { data } = await axios.request(options)
            setOrders(data)
        } catch (error) {
            console.error("Error fetching orders:", error)
            setOrders([]) // Set empty array on error
        }
    }

    useEffect(() => {
        getUserOrders()
    }, [])

    // Format date to a readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return `${date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })} at ${date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })}`
    }

    // Get status color based on order status
    const getStatusColor = (status) => {
        switch(status) {
            case "Active":
                return "bg-blue-500";
            case "Delivered":
                return "bg-green-500";
            case "Pending":
                return "bg-yellow-500";
            case "Cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }

    // Calculate total items in an order
    const getTotalItems = (items) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Helmet>
                <title>My Orders | FreshCart</title>
            </Helmet>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                        <i className="fa-solid fa-truck text-primary-600 text-xl"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                        <p className="text-gray-500">
                            {orders && orders.length > 0 ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''}` : 'Track your order history'}
                        </p>
                    </div>
                </div>
                
                <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                    <i className="fa-solid fa-arrow-left mr-2"></i>
                    Continue Shopping
                </Link>
            </div>

            {orders === null ? (
                <Loading />
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-box-open text-4xl text-gray-400"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No orders yet</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't placed any orders yet.</p>
                    <Link to="/" className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-md transition-colors inline-block font-medium">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Orders List - Left Side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-700">Your Orders ({orders.length})</h2>
                            </div>
                            
                            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                {orders.map((order) => (
                                    <div 
                                        key={order.orderId} 
                                        className={`p-4 cursor-pointer transition-colors ${activeOrder === order.orderId ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                        onClick={() => setActiveOrder(order.orderId)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                                                <p className="font-medium text-gray-800 mt-1">{formatDate(order.orderDate)}</p>
                                                <div className="flex items-center mt-2">
                                                   
                                                    <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        {getTotalItems(order.items)} {getTotalItems(order.items) === 1 ? 'item' : 'items'}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="font-bold text-primary-600">{order.totalPrice.toLocaleString()} L.E</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Order Details - Right Side */}
                    <div className="lg:col-span-2">
                        {activeOrder ? (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {orders.filter(order => order.orderId === activeOrder).map((order) => (
                                    <div key={`details-${order.orderId}`}>
                                        <div className="p-6 border-b border-gray-200">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h2>
                                                    <p className="text-gray-500">{formatDate(order.orderDate)}</p>
                                                   
                                                </div>
                                                <span className={`mt-2 md:mt-0 px-3 py-1 text-sm font-semibold text-white rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h3 className="font-semibold text-gray-700 mb-2 text-lg">Shipping Details :</h3>
                                                <p className="text-gray-600"> Address :{order.address}</p>
                                                <p className="text-gray-600"> Phone Number :{order.phoneNumber}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6">
                                            <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
                                            <div className="space-y-4">
                                                {order.items.map((item) => (
                                                    <div key={`${order.orderId}-${item.productId}`} className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden">
                                                        <div className="w-full sm:w-24 h-24 bg-gray-100">
                                                            <img 
                                                                src={item.images} 
                                                                alt={item.productName} 
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/80?text=Image+Error';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="p-4 flex-grow flex flex-col sm:flex-row justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-gray-800">
                                                                    <Link to={`/product/${item.productId}`} className="hover:text-primary-600">
                                                                        {item.productName}
                                                                    </Link>
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                                                <p className="text-sm mt-2">
                                                                    <span className="font-medium">Qty:</span> {item.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="mt-3 sm:mt-0 text-right">
                                                                <p className="text-gray-600">{item.price} L.E / unit</p>
                                                                <p className="font-bold text-primary-600 mt-1">{item.totalPrice} L.E</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="mt-6 border-t border-gray-200 pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Total Items:</span>
                                                    <span className="font-medium">{getTotalItems(order.items)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-gray-600">Shipping:</span>
                                                    <span className="font-medium">Free</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                                    <span className="text-lg font-bold text-gray-800">Order Total:</span>
                                                    <span className="text-xl font-bold text-primary-600">{order.totalPrice.toLocaleString()} L.E</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="fa-solid fa-receipt text-2xl text-gray-400"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select an order</h3>
                                <p className="text-gray-500">Click on an order from the list to view its details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}