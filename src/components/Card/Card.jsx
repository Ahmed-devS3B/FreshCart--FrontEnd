import { useContext } from "react"
import { cartContext } from "../Context/Cart.Context"
import { Link, useNavigate } from "react-router-dom"
import { WishlistContext } from "../Context/Wishlist.Context"
import { UserContext } from "../Context/User.Context"
import toast from "react-hot-toast"

export default function Card({ productInfo }) {

  const { imageCover, title, price, category,numberOfViewers, id,storeName } = productInfo

  let { addProductToWishlist } = useContext(WishlistContext)
  let { addProductToCart } = useContext(cartContext)
  const { token } = useContext(UserContext)
  const navigate = useNavigate()

  // Function to handle adding to wishlist
  const handleAddToWishlist = () => {
    if (!token) {
      toast.error("Please login first to add items to your wishlist.")
      navigate('/login')
      return;
    }
    addProductToWishlist({ productId: id })
  }

  // Function to handle adding to cart
  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login first to add items to your cart.")
      navigate('/login')
      return;
    }
    addProductToCart({ productId: id })
  }

  return <>
    <div className="card rounded-lg overflow-hidden shadow-lg group/card mt-3">
      <div className="relative">
        <img src={imageCover} alt={title} className="w-full h-48 object-contain" />

        <div className="layer absolute w-full h-full bg-slate-400 let-0 top-0 flex justify-center items-center gap-4 bg-opacity-40 opacity-0
      group-hover/card:opacity-100 transition-opacity duration-300">

          <div onClick={handleAddToWishlist}
            className="icon cursor-pointer w-8 h-8 rounded-full bg-primary-500 text-white flex justify-center items-center ">
            <i className="fa-solid fa-heart"></i>
          </div>

          {/* <div onClick={handleAddToCart}
            className="icon cursor-pointer w-8 h-8 rounded-full bg-primary-500 text-white flex justify-center items-center ">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>/ */}
          <Link to={`/product/${id}`} className="icon cursor-pointer w-8 h-8 rounded-full bg-primary-500 text-white flex justify-center items-center ">
            <i className="fa-solid fa-eye"></i>
          </Link>
        </div>

      </div>

      <div className="card-body p-4 space-y-4">
        <header>
          <h3 className="text-lg text-gray-600 font-semibold line-clamp-1">
            <Link to={`/product/${id}`} >{title}</Link>
          </h3>
          <h4 className=" text-primary-500 font-semibold">{category.name}</h4>
        </header>
        <p className="text-gray-500 text-sm line-clamp-2">{storeName}</p>

        <div className="flex items-center justify-between ">
          <span>{price.toFixed(2)} L.E</span>
          <span className="text-sm text-gray-500"> {numberOfViewers}<i className="fa-solid fa-eye text-sm"></i></span>
          
        </div>
      </div>
    </div>
  </>
}