import React, { useContext } from 'react'
import { WishlistContext } from '../../components/Context/Wishlist.Context'

export default function WishlistItem({ wishlistInfo }) {
    const { 
        price, 
        images, 
        category, 
        productName,
        id,
        _id,
        productId,
        product
    } = wishlistInfo
    

    const itemId = id || _id || productId || product?._id || product?.id;
    
    // const { addProductToCart } = useContext(cartContext)
    const { removeProductFromWishlist } = useContext(WishlistContext)
    
    return <>
        <div className="border-b border-gray-200 py-4 px-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-24 h-24 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={images} alt="" className='w-24 h-24 object-cover rounded-lg' />
            </div>
            
            <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
                <div>                        
                    <h3 className="font-semibold text-gray-700 mb-1 text-lg">
                        {productName}
                    </h3>
                    <h4 className="font-semibold text-sm text-gray-500 mt-1 hidden sm:block">{category}</h4>
                    <p className="text-primary-700 font-bold text-lg mt-2">{price} L.E</p>
                </div>
                
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <button
                        onClick={() => {
                            if (itemId) {
                                removeProductFromWishlist({ productId: itemId });
                            } else {
                                toast.error("Cannot remove item - ID not found");
                            }
                        }}
                        className="text-gray-500 hover:text-red-600 transition-colors duration-200">
                        <i className="fa-solid fa-trash text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </>
}