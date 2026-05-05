import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/imgs/fresh_cart.svg'
import { useContext, useState } from 'react'
import { UserContext } from '../Context/User.Context'
import { cartContext } from '../Context/Cart.Context'
import { ThemeContext } from '../Context/Theme.Context'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { token, role, logOut } = useContext(UserContext)
    const { cartInfo } = useContext(cartContext)
    const { theme, toggleTheme } = useContext(ThemeContext)

    // User is logged in if they have a token OR if they are an Admin
    const isLoggedIn = !!token || role === 'Admin';


    const navLinkClass = ({ isActive }) => {
        return `relative block py-2 md:py-0 transition-colors duration-300 before:absolute before:w-0 before:h-0.5 before:bg-primary-800 before:left-0 before:-bottom-1 ${isActive ? 'before:!w-full font-semibold text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'
            } hover:before:w-full before:transition-[width] before:duration-300 hover:text-primary-600 dark:hover:text-primary-400`
    }

    return (
        <nav className='bg-slate-100 dark:bg-slate-800 transition-colors duration-300 shadow fixed top-0 right-0 left-0 z-50 overflow-hidden'>
            <div className="max-w-full mx-auto">
                {/* Main Navigation */}
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <Link to='/' className="flex-shrink-0">
                        <img src={logo} alt="Fresh Cart Logo" className="h-10 dark:invert" />
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {isLoggedIn ? (
                            <>
                                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                                <NavLink to="/search" className={navLinkClass}>Products</NavLink>
                                {role === 'Customer' && (
                                    <>
                                        <NavLink to="/allorders" className={navLinkClass}>My Orders</NavLink>
                                        <NavLink to="/wishlist" className={navLinkClass}>My Wishlist</NavLink>
                                    </>
                                )}
                                {role === 'Admin' && <NavLink to="/admin" className={navLinkClass}>Dashboard</NavLink>}
                                {role === 'Vendor' && <NavLink to="/vendor" className={navLinkClass}>Dashboard</NavLink>}
                            </>
                        ) : (
                            <>
                                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                                <NavLink to="/search" className={navLinkClass}>Products</NavLink>
                            </>
                        )}
                    </div>

                    {/* Right Side Items */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-slate-700' : 'fa-sun text-yellow-400'} text-xl`}></i>
                        </button>

                        {/* Social Icons */}
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/share/18XUMjAgUh/?mibextid=wwXIfr" target='_blank' rel="noopener noreferrer">
                                <i className='fa-brands fa-facebook text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'></i>
                            </a>
                            <a href="https://www.instagram.com/ahmeed.iibrahiiim?igsh=bTZjdXk3ZXVvb2N1&utm_source=qr" target='_blank' rel="noopener noreferrer">
                                <i className='fa-brands fa-instagram text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300'></i>
                            </a>
                        </div>

                        {/* Cart */}
                        {role === 'Customer' && token && (
                            <Link to='/cart' className="relative text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">
                                <i className='fa-solid fa-cart-shopping text-xl'></i>
                                <div className="absolute -top-2 -right-2 h-5 w-5 flex justify-center items-center rounded-full bg-primary-500 text-white text-xs font-semibold">
                                    {cartInfo ? cartInfo.numOfCartItems : <i className='fa-solid fa-spinner fa-spin'></i>}
                                </div>
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {!isLoggedIn ? (
                            <div className="flex space-x-4">
                                <NavLink to="/signup" className={navLinkClass}>Sign Up</NavLink>
                                <NavLink to="/login" className={navLinkClass}>Log In</NavLink>
                            </div>
                        ) : (
                            <button onClick={logOut} className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">
                                <i className='fa-solid fa-right-from-bracket text-xl'></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="px-4 pt-4 space-y-4">
                        {isLoggedIn ? (
                            <div className="space-y-2">
                                <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                                <NavLink to="/search" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Products</NavLink>
                                {role === 'Customer' && (
                                    <>
                                        <NavLink to="/allorders" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>My Orders</NavLink>
                                        <NavLink to="/wishlist" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>My Wishlist</NavLink>
                                    </>
                                )}
                                {role === 'Admin' && <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>}
                                {role === 'Vendor' && <NavLink to="/vendor" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                                <NavLink to="/search" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Products</NavLink>
                            </div>
                        )}

                        <div className="flex justify-center space-x-6 pt-4 border-t border-gray-200">
                            <a href="https://www.facebook.com/share/18XUMjAgUh/?mibextid=wwXIfr" target='_blank' rel="noopener noreferrer">
                                <i className='fa-brands fa-facebook text-blue-600 text-xl'></i>
                            </a>
                            <a href="https://www.instagram.com/ahmeed.iibrahiiim?igsh=bTZjdXk3ZXVvb2N1&utm_source=qr" target='_blank' rel="noopener noreferrer">
                                <i className='fa-brands fa-instagram text-amber-600 text-xl'></i>
                            </a>
                        </div>

                        {!isLoggedIn ? (
                            <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
                                <NavLink to="/signup" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Sign Up</NavLink>
                                <NavLink to="/login" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Log In</NavLink>
                            </div>
                        ) : (
                            <div className="flex justify-center pt-4 border-t border-gray-200">
                                <button onClick={logOut} className="hover:text-primary-600">
                                    <i className='fa-solid fa-right-from-bracket text-xl'></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
