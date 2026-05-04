import { createContext, useContext, useState } from "react";
import { UserContext } from "./User.Context";
import axios from "axios";
import toast from "react-hot-toast";

export const WishlistContext = createContext(null);

export default function WishlistProvider({ children }) {
  const { token } = useContext(UserContext);
  const [wishlistInfo, setWishlistInfo] = useState(null);

  // Base API URL
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/Customer`;

  // Add product to wishlist
  async function addProductToWishlist({ productId }) {
    let toastId = toast.loading("Adding Product to Wishlist...");
    try {
      const options = {
        url: `${API_BASE_URL}/savedproducts`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          productId,
        },
      };
      
      await axios.request(options);
      toast.success("Product Added To Wishlist ✅");
      getProductFromWishlist(); // Update the wishlist
    } catch (error) { 
      toast.error(error.response?.data?.message || "Failed to add product to wishlist");
    } finally {
      toast.dismiss(toastId);
    }
  }

  // Get products from the wishlist
  async function getProductFromWishlist() {
    try {
      const options = {
        url: `${API_BASE_URL}/savedproducts`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let { data } = await axios.request(options);
      
      // Store the response directly - it's already an array of products
      setWishlistInfo(data);
    } catch (error) {
      setWishlistInfo([]); // Set empty array on error
    }
  }

  // Remove product from the wishlist
  async function removeProductFromWishlist({ productId }) {
    // Validate productId
    if (!productId) {
      toast.error("Cannot remove: Product ID is missing");
      return;
    }
    
    let toastId = toast.loading("Removing Product...");
    
    try {
      const options = {
        url: `${API_BASE_URL}/savedproducts/${productId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      
      await axios.request(options);
      toast.success("Product Removed Successfully ✅");
      getProductFromWishlist(); // Update the wishlist
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product from wishlist");
    } finally {
      toast.dismiss(toastId);
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        addProductToWishlist,
        getProductFromWishlist,
        removeProductFromWishlist,
        wishlistInfo,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}