import { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "./User.Context";
import axios from "axios";
import toast from "react-hot-toast";

export const cartContext = createContext(null);

export default function CartProvider({ children }) {
    const { token } = useContext(UserContext);
    const [cartInfo, setCartInfo] = useState({ numOfCartItems: 0, products: [] });

    // Reset cart when user logs out
    useEffect(() => {
        if (token) {
            getCartProducts();
        } else {
            setCartInfo({ numOfCartItems: 0, products: [] });
        }
    }, [token]);

    // Add product to cart function
    async function addProductToCart({ productId, quantity }) {
        let toastId = toast.loading('Adding product...');
        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Customer/cart`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    productId: productId,
                    quantity: quantity,
                }
            };

            let { data } = await axios.request(options);
            
            if (data.message) {
                toast.success(data.message);
                getCartProducts();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Failed to add product');
        } finally {
            toast.dismiss(toastId);
        }
    }

    // Get cart products function
    async function getCartProducts() {
        if (!token) {
            setCartInfo({ numOfCartItems: 0, products: [] });
            return;
        }
        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Customer/cart`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
    
            let { data } = await axios.request(options);
    
            const products = Array.isArray(data) ? data : [];
    
            setCartInfo({
                numOfCartItems: products.length,
                products: products
            });
    
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setCartInfo({ numOfCartItems: 0, products: [] });
            } else {
                setCartInfo({ numOfCartItems: 0, products: [] });
            }
        }
    }

    // Remove specific product from the cart function
    async function removeProductFromCart({ cartItemId }) {
        let toastId = toast.loading('Deleting Product...');
        try {
            const options = {
                url: `${import.meta.env.VITE_API_URL}/Customer/cart/${cartItemId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.request(options);
    
            toast.success('Product has been removed from your cart');
            getCartProducts(); 
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Failed to remove product');
        } finally {
            toast.dismiss(toastId);
        }
    }

    // Clear entire cart function
    async function clearCart() {
        if (!token || !cartInfo.products.length) {
            setCartInfo({ numOfCartItems: 0, products: [] });
            return;
        }

        let toastId = toast.loading('Clearing cart...');
        try {
            await getCartProducts(); // Fetch the latest cart state
        } catch (error) {
            toast.error('Failed to clear cart. Cart reset locally.');
            setCartInfo({ numOfCartItems: 0, products: [] });
        } finally {
            toast.dismiss(toastId);
        }

    }

    return (
        <cartContext.Provider value={{
            cartInfo,
            addProductToCart,
            getCartProducts,
            removeProductFromCart,
            clearCart
        }}>
            {children}
        </cartContext.Provider>
    );
}