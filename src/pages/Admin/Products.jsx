import { useEffect, useState } from 'react';
import { getPendingProducts, approveProduct, rejectProduct  } from '../../api/adminApi';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await getPendingProducts();
        const data = res.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);

  const handlePrediction = async (productId, action) => {
    try {
      if (action === 'accept') {
        await approveProduct(productId);
      }
       else if (action === 'reject') {
        await rejectProduct(productId);
       }// will be edited after then
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Product Approvals</h1>
      
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className='px-6 py-3 text-left  text-sm font-medium text-gray-500 '> Owner Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No pending products.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 text-sm text-gray-800">{product.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{product.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">${product.price}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handlePrediction(product.id, 'accept')}
                        className="px-3 py-1.5 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handlePrediction(product.id, 'reject')}
                        className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}