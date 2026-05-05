import React, { useContext, useEffect } from 'react';
import { WishlistContext } from '../../components/Context/Wishlist.Context';
import WishlistItem from '../../components/WishlistItem/WishlistItem';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const { wishlistInfo, getProductFromWishlist } = useContext(WishlistContext);

    useEffect(() => {
        getProductFromWishlist();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-heart text-2xl text-primary-500"></i>
                <h1 className="text-2xl font-bold text-gray-700 dark:text-slate-100">My Wishlist</h1>
            </div>

            {wishlistInfo && wishlistInfo.length > 0 ? (
                <div className="space-y-4">
                    {wishlistInfo.map((item, index) => (
                        <WishlistItem key={index} wishlistInfo={item} />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto mt-8 transition-colors">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <i className="fa-regular fa-heart text-4xl text-primary-500"></i>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-200 mb-3">Your wishlist is empty</h2>

                    <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Items added to your wishlist will be saved here. Discover products you love and save them for later!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/"
                            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2">
                            <i className="fa-solid fa-store"></i>
                            <span>Browse Products</span>
                        </Link>

                        <Link to="/search"
                            className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 font-medium py-3 px-6 rounded-lg border border-gray-300 dark:border-slate-600 transition duration-300 flex items-center justify-center gap-2">
                            <i className="fa-solid fa-tags"></i>
                            <span>Explore Products</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}