import React, { useContext, useEffect } from 'react';
import { cartContext } from '../../components/Context/Cart.Context';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { Helmet } from 'react-helmet';

export default function Cart() {
  const { cartInfo, getCartProducts, removeProductFromCart } = useContext(cartContext);

  useEffect(() => {
    getCartProducts();
  }, []);

  if (!cartInfo) {
    return <Loading />;
  }

  // Check if cart is empty
  if (!cartInfo.products || cartInfo.products.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center transition-colors">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-cart-shopping text-4xl text-gray-400 dark:text-slate-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/" 
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-md transition-colors inline-block font-medium"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Calculate total price of all items
  const totalCartPrice = cartInfo.products.reduce((total, item) => total + item.totalPrice, 0);
  const totalItems = cartInfo.products.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Helmet>
        <title>Your Cart | FreshCart</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
            <i className="fa-solid fa-cart-shopping text-primary-600 dark:text-primary-400 text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Your Shopping Cart</h1>
            <p className="text-gray-500 dark:text-slate-400">{totalItems} items in your cart</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-colors">
              <div className="p-4 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <h2 className="font-semibold text-gray-700 dark:text-slate-200">Cart Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {cartInfo.products.map((item) => (
                  <div key={item.cartItemId} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden">
                        <img 
                          src={item.images.replace(/`/g, '').trim()} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80?text=Image+Error';
                          }}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-slate-100 text-lg">{item.productName}</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{item.category}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <p className="text-primary-600 dark:text-primary-400 font-bold">{item.price} L.E</p>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <p className="font-medium text-gray-700 dark:text-slate-300">
                            Subtotal: <span className="text-primary-600 dark:text-primary-400">{item.totalPrice} L.E</span>
                          </p>
                          <button 
                            onClick={() => removeProductFromCart({ cartItemId: item.cartItemId })}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1 text-sm"
                          >
                            <i className="fa-solid fa-trash"></i>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Link 
                to="/"
                className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 sticky top-6 transition-colors">
              <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                  <span>Items ({totalItems}):</span>
                  <span>{totalCartPrice} L.E</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-slate-400">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-slate-100">
                    <span>Total:</span>
                    <span className="text-primary-600 dark:text-primary-400">{totalCartPrice} L.E</span>
                  </div>
                  <p className="text-gray-500 dark:text-slate-500 text-xs mt-1">Including VAT</p>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-md transition-colors block text-center font-medium"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-slate-400 text-sm mb-2">
                  <i className="fa-solid fa-lock"></i>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  <i className="fa-brands fa-cc-visa text-2xl text-gray-600 dark:text-slate-400"></i>
                  <i className="fa-brands fa-cc-mastercard text-2xl text-gray-600 dark:text-slate-400"></i>
                  <i className="fa-brands fa-cc-paypal text-2xl text-gray-600 dark:text-slate-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
