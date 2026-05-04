import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import Loading from "../../components/Loading/Loading";
import { Helmet } from "react-helmet";
import Pagination from "../../components/Pagination/Pagination";

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);

  // Fetch all products once
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/Customer/products`);
        setAllProducts(data);
      } catch (error) {
        // setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products when searchInput or allProducts changes
  useEffect(() => {
    let filtered = allProducts;
    if (searchInput) {
      const lowerQuery = searchInput.toLowerCase();
      filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(lowerQuery) ||
        (product.category && product.category.toLowerCase().includes(lowerQuery))
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on new search

    // Update URL query param (optional, for shareability)
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }
    setSearchParams(params, { replace: true });
  }, [searchInput, allProducts]);

  // Pagination logic
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query}` : "Product Search"}</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">Product Search</h1>
        <div className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        {!loading && !error && (
          <div className="mb-4 text-gray-600">
            Showing {paginatedProducts.length} of {filteredProducts.length} results
            {query && ` for "${query}"`}
          </div>
        )}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="bg-red-100 p-8 rounded-lg text-center">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <Card
                    key={product.id}
                    productInfo={{
                      id: product.id,
                      title: product.title,
                      description: product.description,
                      price: product.price,
                      category: { name: product.category },
                      imageCover: product.images,
                      storeName: product.storeName,
                      numberOfViewers: product.numberOfViewers
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="bg-gray-50 rounded-full p-6 mb-6">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {query ? `No results for "${query}"` : "No products available"}
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  {query
                    ? "We couldn't find any products matching your search. Try different keywords or browse our categories."
                    : "There are currently no products available in our store. Please check back later."
                  }
                </p>
                {query && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      const params = new URLSearchParams(searchParams);
                      params.delete("q");
                      setSearchParams(params);
                    }}
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
