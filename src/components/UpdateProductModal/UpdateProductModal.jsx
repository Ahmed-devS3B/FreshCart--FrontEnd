import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function UpdateProductModal({ isOpen, onClose, product, onUpdate }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: ''
  });

  // Add this useEffect to update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.numberOfAvailableUnits || '',
        category: product.category || '',
        image: product.images || ''
      });
    }
  }, [product]);

  // Improved animation handling for better performance
  useEffect(() => {
    if (isOpen) {
      // Show modal immediately when opening
      setIsAnimating(true);
    } else {
      // Use a shorter timeout for snappier UI feedback 
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Reduced from 1000ms to 300ms for better user experience
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating product...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in again.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/Vendor/updateproduct/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          Title: formData.title,
          Description: formData.description,
          Price: Number(formData.price),
          NumberOfAvailableUnits: Number(formData.quantity),
          Category: formData.category,
          Images: formData.image
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (!isAnimating && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-200 flex items-center justify-center z-50 ${
        isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg p-8 w-full max-w-2xl transform transition-all duration-200 ${
          isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Update Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition duration-200"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}