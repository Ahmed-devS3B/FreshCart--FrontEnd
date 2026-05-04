import axios from "axios";
import Card from "../../components/Card/Card";
import Loading from "../../components/Loading/Loading";
import { useEffect, useState } from "react";
import HomeSlider from "../../components/HomeSlider/HomeSlider";
import Pagination from "../../components/Pagination/Pagination";
import { Helmet } from "react-helmet";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 12;

  // Fetch products using axios
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/Customer/products`
        );
        setAllProducts(response.data);
        setTotalResults(response.data.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []); // Only fetch on component mount

  // Handle pagination locally
  useEffect(() => {
    if (allProducts.length > 0) {
      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      setDisplayedProducts(allProducts.slice(startIndex, endIndex));
    }
  }, [currentPage, allProducts]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <Loading />;

 

  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <HomeSlider />

      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-8 mt-8 text-lg text-gray-600 font-semibold">Popular Products</h2>

        {/* Products Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {displayedProducts.map((product) => (
            <Card key={product.id} productInfo={{
              id: product.id,
              title: product.title,
              description: product.description,
              price: product.price,
              category: { name: product.category },
              imageCover: product.images ,
              storeName:product.storeName,
              numberOfViewers:product.numberOfViewers

            }} />
          ))}
        </div>

        {/* Pagination */}
        {totalResults > productsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalResults / productsPerPage)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}