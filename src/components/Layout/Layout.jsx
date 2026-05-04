import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function Layout() {
  const { pathname } = useLocation(); // Get the current location object

  // Scroll to top smoothly on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Add smooth behavior
    });
  }, [pathname]);

  return (
    // Add flex container to make footer sticky
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Make main content grow to fill available space */}
      <main className="container mx-auto px-4 py-8 mt-20 flex-grow ">
        <Outlet /> {/* Child routes will render here */}
      </main>
      <Footer />
    </div>
  );
}
