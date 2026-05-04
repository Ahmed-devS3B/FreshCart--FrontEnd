import React, { useContext } from 'react';
import { cartContext } from '../Context/Cart.Context';

export default function CartItem({ item }) {
  const { removeProductFromCart } = useContext(cartContext);
  
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4 px-4">
      <div className="flex items-center space-x-4">
        <img 
          src={item.images.replace(/`/g, '').trim()} 
          alt={item.productName} 
          className="w-20 h-20 object-cover rounded-md"
        />
        <div>
          <h3 className="font-medium text-gray-800">{item.productName}</h3>
          <p className="text-sm text-gray-500">{item.category}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">Quantity:</span> {item.quantity}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="text-sm text-gray-500">Price: {item.price} L.E</p>
          <p className="font-bold text-primary-600">Total: {item.totalPrice} L.E</p>
        </div>
        <button 
          onClick={() => removeProductFromCart({ productId: item.productId })}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
}
