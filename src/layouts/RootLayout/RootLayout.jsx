import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/sharedItems/Navbar/Navbar';

import PopUp from '../../components/sharedItems/PopUp/PopUp';
import useAuth from '../../hooks/UseAuth/useAuth';
import Footer from '../../components/sharedItems/Footer/Footer';

const RootLayout = () => {
  const { user , loading} = useAuth();
  const [showPopup, setShowPopup] = useState(false);

useEffect(() => {
  const popupShown = localStorage.getItem("popupShown");

  if (!loading && !user && !popupShown) {
    setShowPopup(true);
  }
}, [user, loading]);


  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("popupShown", "true"); // Prevent future popups
  };

  return (
    <div>
      <nav className="sticky top-0 z-50 shadow-md">
        <Navbar />
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>

      {/* Show popup only if needed */}
      {showPopup && <PopUp onClose={handleClosePopup} />}
    </div>
  );
};

export default RootLayout;
