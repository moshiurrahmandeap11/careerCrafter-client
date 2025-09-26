import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/sharedItems/Navbar/Navbar';

import PopUp from '../../components/sharedItems/PopUp/PopUp';
import useAuth from '../../hooks/UseAuth/useAuth';

const RootLayout = () => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if popup already shown before
    const popupShown = localStorage.getItem("popupShown");

    if (!user && !popupShown) {
      setShowPopup(true);
    }
  }, [user]);

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
      <footer></footer>

      {/* Show popup only if needed */}
      {showPopup && <PopUp onClose={handleClosePopup} />}
    </div>
  );
};

export default RootLayout;
