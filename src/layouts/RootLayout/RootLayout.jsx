import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/sharedItems/Navbar/Navbar';
import PopUp from '../../components/sharedItems/PopUp/PopUp';
import useAuth from '../../hooks/UseAuth/useAuth';
import Footer from '../../components/sharedItems/Footer/Footer';
import AiChatBot from './AiChatBot/AiChatBot';

const RootLayout = () => {
  const { user, loading } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    const popupShown = localStorage.getItem("popupShown");

    if (!loading && !user && !popupShown) {
      setShowPopup(true);
    }
  }, [user, loading]);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("popupShown", "true");
  };

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 shadow-md">
        <Navbar />
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>

      {/* Show popup only if needed */}
      {showPopup && <PopUp onClose={handleClosePopup} />}

      {/* Chat Bot Container */}
      <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
        {/* Chat Bot Toggle Button */}
        <button
          onClick={toggleChatBot}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open AI Chat Bot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 md:h-7 md:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>

        {/* Chat Bot Component */}
        {showChatBot && (
          <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-[400px] md:max-w-[450px] md:w-[95vw] h-[500px] md:h-[600px] lg:h-[700px]">
            <AiChatBot onClose={() => setShowChatBot(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RootLayout;