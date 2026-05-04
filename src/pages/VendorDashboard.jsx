import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UpdateProductModal from '../components/UpdateProductModal/UpdateProductModal';
import { UserContext } from '../components/Context/User.Context';

export default function VendorDashboard() {
  const { logOut } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  // Initialize vendorName from localStorage if available
  const [vendorName, setVendorName] = useState(() => {
    return localStorage.getItem("vendorName") || 'Vendor';
  });
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  //add product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("You are not logged in. Please log in again.");
        setLoading(false);
        return;
      }
      const toastId = toast.loading("Adding Product..");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/Vendor/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          Title: name,
          Description: description,
          Price: Number(price),
          Images: image,
          NumberOfAvailableUnits: Number(quantity),
          StoreName: "YourStoreName",
          Category: category
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      toast.dismiss(toastId);

      if (response.ok) {
        toast.success(data.message || "Product added successfully!");
        setName('');
        setDescription('');
        setQuantity('');
        setPrice('');
        setImage('');
        setCategory('');
      } else if (response.status === 401) {
        setStatus("Unauthorized. Please log in again.");
        toast.error("Unauthorized. Please log in again.");
        // Optionally redirect to login after a delay
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        const errorMessage = data.message || 'Error submitting product.';
        setStatus(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Add product error:", error);
      setStatus('Network error or issue parsing response. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logOut();
    localStorage.removeItem("vendorName");
    navigate('/vendor-login');
  };

  // Fetch vendor information when component mounts
  useEffect(() => {
    // Fetch immediately on mount
    fetchVendorInfo();
    // Also fetch products for the dashboard
    fetchProducts();
  }, []);

  // Fetch products when the tab changes to 'pending' or 'products'
  useEffect(() => {
    // Fetch products when the component mounts or when activeTab changes to 'pending', 'products', or 'dashboard'
    if (activeTab === 'pending' || activeTab === 'products' || activeTab === 'dashboard') {
      fetchProducts();
    }
  }, [activeTab]);

  // Fetch vendor information including name
  const fetchVendorInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/Vendor/listproducts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        },
      });

      const data = await response.json();
      if (response.ok && data.length > 0 && data[0].ownerName) {
        // Save the name to both state and localStorage
        setVendorName(data[0].ownerName);
        localStorage.setItem("vendorName", data[0].ownerName);
      }
    } catch (error) {
      console.error("Error fetching vendor info:", error);
    }
  };

  // list vendor products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/Vendor/listproducts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        },
      });

      const data = await response.json();
      if (response.ok) {
        // Filter out products where isDeleted is true
        const activeProducts = data.filter(product => !product.isDeleted);
        setProducts(activeProducts);

        // Extract owner name from the response if available
        if (data.length > 0 && data[0].ownerName) {
          setVendorName(data[0].ownerName);
          localStorage.setItem("vendorName", data[0].ownerName);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    }
  };

  //delete products
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in again.");
        return;
      }

      const loadingToastId = toast.loading("Deleting product...");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/Vendor/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        }
      });

      toast.dismiss(loadingToastId);

      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));

        //  more reliable 
        fetchProducts();

        toast.success("Product deleted successfully!");
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      toast.error("Error deleting product. Please try again.");
    }
  };

  // Fetch orders for vendor products
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Vendor/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    }
  };

  // Fetch orders when the tab changes to 'orders'
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-lg font-semibold text-primary-700">Vendor Panel</div>
        <div className="w-10"></div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <div className="text-2xl font-bold text-primary-700 mb-8">Vendor Panel</div>
              <nav className="flex flex-col gap-2">
                <button
                  className={`text-left px-4 py-2 rounded hover:bg-primary-50 transition ${activeTab === 'dashboard' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => {
                    setActiveTab('dashboard');
                    setIsSidebarOpen(false);
                  }}
                >
                  Dashboard
                </button>
                <button
                  className={`text-left px-4 py-2 rounded hover:bg-primary-50 transition ${activeTab === 'add' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => {
                    setActiveTab('add');
                    setIsSidebarOpen(false);
                  }}
                >
                  Add Product
                </button>
                <button
                  className={`text-left px-4 py-2 rounded hover:bg-primary-50 transition ${activeTab === 'products' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => {
                    setActiveTab('products');
                    setIsSidebarOpen(false);
                  }}
                >
                  My Products
                </button>
                <button
                  className={`text-left px-4 py-2 rounded hover:bg-primary-50 transition ${activeTab === 'pending' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => {
                    setActiveTab('pending');
                    setIsSidebarOpen(false);
                  }}
                >
                  Pending Actions
                </button>
                <button
                  className={`text-left px-4 py-2 rounded hover:bg-primary-50 transition ${activeTab === 'orders' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700'
                    }`}
                  onClick={() => {
                    setActiveTab('orders');
                    setIsSidebarOpen(false);
                  }}
                >
                  Orders
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          <header className="hidden lg:flex bg-white shadow items-center justify-between px-8 py-4">
            <div className="text-xl font-semibold text-gray-800">Welcome, {vendorName}</div>
            <div className="flex items-center gap-4">
              <button className="text-primary-600 hover:underline" onClick={handleLogout}>
                Logout
              </button>
              <span className="text-gray-500"></span>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(vendorName)}&background=0D8ABC&color=fff`}
                alt="Vendor Avatar"
                className="w-9 h-9 rounded-full border"
              />
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-4 lg:p-8 bg-gray-50">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                <div className="border-b border-primary-500 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="bg-white rounded shadow p-4 lg:p-6 text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary-600 mb-2">{products.length}</div>
                    <div className="text-gray-600">Total Products</div>
                  </div>
                  <div className="bg-white rounded shadow p-4 lg:p-6 text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-2">
                      {products.filter(p => !p.isApproved && !p.isRejected).length}
                    </div>
                    <div className="text-gray-600">Pending Approvals</div>
                  </div>
                  <div className="bg-white rounded shadow p-4 lg:p-6 text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">
                      {products.filter(p => p.isApproved).length}
                    </div>
                    <div className="text-gray-600">Approved Products</div>
                  </div>
                  <div className="bg-white rounded shadow p-4 lg:p-6 text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-red-600 mb-2">
                      {products.filter(p => p.isRejected).length}
                    </div>
                    <div className="text-gray-600">Rejected Products</div>
                  </div>
                </div>
              </div>
            )}
            

            {activeTab === 'add' && (
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <div className="border-b border-primary-500 mb-4"></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product name..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Category"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Image URL</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Image URL..."
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Quantity</label>
                    <input
                      type="number"
                      className="w-full border rounded px-3 py-2"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Quantity..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                      type="number"
                      className="w-full border rounded px-3 py-2"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price..."
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Add Product'}
                  </button>
                  {status && (
                    <div className="mt-4 text-center text-sm text-red-600">
                      {status}
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Products</h2>
                <div className="border-b border-primary-500 mb-4"></div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full bg-white rounded shadow">
                    <thead>
                      <tr className='border-b border-gray-200 '>
                        <th className="px-4 py-2 font-bold text-lg text-center pb-5">Product Name</th>
                        <th className="px-4 py-2 text-center font-bold text-lg pb-5">Description</th>
                        <th className="px-4 py-2 text-center font-bold text-lg pb-5">Price</th>
                        <th className="px-4 py-2 text-center font-bold text-lg pb-5">Status</th>
                        <th className="px-4 py-2 text-center font-bold text-lg pb-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                            No products available.
                          </td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id}>
                            <td className=" text-gray-500 px-4 text-center py-2 ">{product.title}</td>
                            <td className="text-gray-500 px-4 text-center py-2">{product.description.split(' ').slice(0, 3).join(' ')}...</td>
                            <td className="text-gray-500 px-4 text-center py-2">{product.price} $</td>
                            <td className={`text-lg font-bold px-4 text-center py-2 ${product.isApproved === true ? 'text-green-600' :
                                product.isRejected === true ? 'text-red-600' :
                                  'text-blue-600'
                              }`}>
                              {product.isApproved === true ? 'Approved' : product.isRejected === true ? "Rejected.." : "Pending.."}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {!product.isRejected && (
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsUpdateModalOpen(true);
                                  }}
                                  className="text-primary-600 border-2 border-primary-600 rounded-md px-2 py-1 mr-2 hover:bg-primary-600 hover:text-white hover:cursor-pointer transition-all duration-300"
                                >
                                  Update
                                </button>
                              )}
                              <button onClick={() => handleDelete(product.id)} className="text-red-600 border-2 border-red-600 rounded-md px-2 py-1 mr-2 hover:bg-red-600 hover:text-white hover:cursor-pointer transition-all duration-300">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {products.length === 0 ? (
                    <div className="text-gray-600">No products available.</div>
                  ) : (
                    products.map(product => (
                      <div className="bg-white rounded-lg shadow p-4" key={product.id}>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-500">Name</span>
                            <p className="font-medium">{product.title}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Description</span>
                            <p className="font-medium">{product.description.split(' ').slice(0, 4).join(' ')}...</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Price</span>
                            <p className="font-medium">${product.price}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Status</span>
                            <p className={`font-medium ${product.isApproved === true ? 'text-green-600' :
                                product.isRejected === true ? 'text-red-600' :
                                  'text-blue-600'
                              }`}>
                              {product.isApproved === true ? 'Approved' : product.isRejected === true ? 'Rejected..' : 'Pending..'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Category</span>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Available Units</span>
                            <p className="font-medium">{product.numberOfAvailableUnits}</p>
                          </div>
                          <div className="pt-2 flex gap-2">
                            {!product.isRejected && (
                              <button
                                className="flex-1 text-primary-600 border-2 border-primary-600 rounded-md px-2 py-1 hover:bg-primary-50 transition-colors"
                              >
                                Edit
                              </button>
                            )}
                            <button onClick={() => handleDelete(product.id)}
                              className={`${!product.isRejected ? 'flex-1' : 'w-full'} text-red-600 border-2 border-red-600 rounded-md px-2 py-1 hover:bg-red-50 transition-colors`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'pending' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Pending Actions</h2>
                <div className="border-b border-primary-500 mb-4"></div>
                {products.filter(product => !product.isApproved && !product.isRejected).length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-600 text-lg font-medium">No pending products</p>
                    <p className="text-gray-500 mt-2 text-center">All your products have been reviewed. Add new products to see them here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products
                      .filter(product => !product.isApproved && !product.isRejected)
                      .map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg text-gray-800 truncate">{product.title}</h3>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Pending</span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {product.images && (
                              <div className="w-full h-40 mb-3 bg-gray-100 rounded overflow-hidden">
                                <img 
                                  src={product.images} 
                                  alt={product.title} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="text-gray-700">
                                <span className="font-medium">${product.price}</span>
                                <span className="mx-1">•</span>
                                <span>{product.numberOfAvailableUnits || 0} in stock</span>
                              </div>
                              <div className="text-gray-500 text-xs">
                                {new Date(product.createdAt || Date.now()).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-4 py-3 flex justify-between">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsUpdateModalOpen(true);
                              }}
                              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                            >
                              Edit Product
                            </button>
                            <div className="flex items-center text-yellow-600">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                              </svg>
                              <span className="text-xs font-medium">Awaiting Approval</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">My Orders</h2>
                <div className="border-b border-primary-500 mb-4"></div>
                {orders.length === 0 ? (
                  <div className="text-gray-600">No orders found for your products.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                      <thead>
                        <tr className='border-b border-gray-200 '>
                          <th className="px-4 py-2 font-bold text-lg text-center pb-5">Order ID</th>
                          <th className="px-4 py-2 text-center font-bold text-lg pb-5">Product</th>
                          <th className="px-4 py-2 text-center font-bold text-lg pb-5">Quantity</th>
                          <th className="px-4 py-2 text-center font-bold text-lg pb-5">Customer Phone Number</th>
                          <th className="px-4 py-2 text-center font-bold text-lg pb-5">Status</th>
                          <th className="px-4 py-2 text-center font-bold text-lg pb-5"> Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order ) => (
                          <tr key={order.orderId}>
                            <td className="text-gray-500 px-4 text-center py-2">{order.orderId || "No order id"}</td>
                            <td className="text-gray-500 px-4 text-center py-2">{order.items[0].productName || "No product name"}</td>
                            <td className="text-gray-500 px-4 text-center py-2">{order.items[0].quantity || "No quantity" }</td>
                            <td className="text-gray-500 px-4 text-center py-2">{order.customerPhoneNumber || "No phone number"}</td>
                            <td className="text-gray-500 px-4 text-center py-2">{order.status}</td>
                            <td className="text-gray-500 px-4 text-center py-2">{order.orderDate 
                              ? new Date(order.orderDate).toLocaleString('en-US', {
                                weekday: 'short',
                                day: 'numeric', // Adds the day of month
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }) 
                            : "No date available"}
                          </td>
                          </tr>   
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        product={selectedProduct}
        onUpdate={fetchProducts}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}