import amazonLogo from '../../assets/imgs/amazon-pay.png'
import americanExpLogo from '../../assets/imgs/American-Express-Color.png'
import masterLogo from '../../assets/imgs/mastercard.webp'
import paypalLogo from '../../assets/imgs/paypal.png'
import appStoreLogo from '../../assets/imgs/get-apple-store.png'
import googlePlayStore from '../../assets/imgs/get-google-play.png'

export default function Footer() {
    return (
        <footer className='bg-slate-100 py-10 mt-auto border-t border-slate-200'>
            <div className="container mx-auto px-4">
                {/* App Download Section */}
                <div className="space-y-4 mb-8">
                    <h2 className='text-2xl font-semibold text-slate-800'>Get The FreshCart App</h2>
                    <p className='text-slate-500'>We will send you a link to download the app, open it on your phone to download the app from the app store.</p>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className='form-control flex-grow py-2 px-4 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
                        />
                        <button className='btn bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-8 rounded-md transition-colors duration-300'>
                            Share App Link
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center py-6 border-y border-slate-200 gap-6">
                    {/* Payment Partners */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <h3 className="font-medium text-slate-800 whitespace-nowrap ">Payment Partners</h3>
                        <div className="flex flex-wrap justify-center gap-4 cursor-pointer">
                            <img className='w-14 h-8 object-contain grayscale hover:grayscale-0 transition-all' src={amazonLogo} alt="Amazon Pay" />
                            <img className='w-14 h-8 object-contain grayscale hover:grayscale-0 transition-all' src={americanExpLogo} alt="American Express" />
                            <img className='w-14 h-8 object-contain grayscale hover:grayscale-0 transition-all' src={masterLogo} alt="Mastercard" />
                            <img className='w-14 h-8 object-contain grayscale hover:grayscale-0 transition-all' src={paypalLogo} alt="PayPal" />
                        </div>
                    </div>

                    {/* App Stores */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4">
                        <h3 className="font-medium text-slate-800 whitespace-nowrap">Get deliveries with FreshCart</h3>
                        <div className="flex gap-3">
                            <img className='w-28 h-9 object-contain cursor-pointer' src={appStoreLogo} alt="App Store" />
                            <img className='w-28 h-9 object-contain cursor-pointer' src={googlePlayStore} alt="Google Play Store" />
                        </div>
                    </div>
                </div>

                {/* Social Links & Copyright */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 order-2 md:order-1">
                        © {new Date().getFullYear()} <span className='text-primary-600 font-semibold'>FreshCart</span>. All rights reserved.
                    </p>

                    <div className="flex items-center space-x-6 order-1 md:order-2">
                        <a href="https://www.facebook.com/share/18XUMjAgUh/?mibextid=wwXIfr" target='_blank' rel="noopener noreferrer" className="text-slate-600 hover:text-blue-600 transition-colors">
                            <i className='fa-brands fa-facebook text-xl'></i>
                        </a>
                        <a href="https://www.instagram.com/ahmeed.iibrahiiim?igsh=bTZjdXk3ZXVvb2N1&utm_source=qr" target='_blank' rel="noopener noreferrer" className="text-slate-600 hover:text-pink-600 transition-colors">
                            <i className='fa-brands fa-instagram text-xl'></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
