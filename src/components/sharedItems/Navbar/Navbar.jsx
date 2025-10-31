import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageCircle,
  Bell,
  User,
  Building,
  Crown,
  Menu,
  X,
  FileText,
  Sparkles,
  Target,
  Bot,
  Zap,
  ChevronDown,
  Settings,
  LogOut,
  LogIn,
  Star,
  FileCheck2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../Loader/Loader";
import useAuth from "../../../hooks/UseAuth/useAuth";
import Swal from "sweetalert2";
import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import { AuthContext } from "../../../contexts/AuthContexts/AuthContexts";

const Navbar = () => {
  const { user, loading, userLogOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [logoData, setLogoData] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAIToolsMenu, setShowAIToolsMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // Generate initials from full name
  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate deterministic background color based on name
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`; // nice color variation
    return color;
  };

  // New state for message notifications
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [messageNotifications, setMessageNotifications] = useState([]);

  const searchNavigate = useNavigate();

  const { setSearchResult, setSearchTopic } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!searchValue.trim()) return; // empty search

    try {
      const res = await axiosIntense.get(
        `/top-search/search?query=${encodeURIComponent(searchValue)}`
      );
      console.log(res.data);

      const { type, results } = res.data;
      if (type == "job") {
        searchNavigate("/searchJob");
        setSearchResult(results);
        setSearchTopic(searchValue);
      } else if (type == "user") {
        searchNavigate("/searchUser");
        setSearchResult(results);
        setSearchTopic(searchValue);
      } else {
        searchNavigate("/noSearchResult");

        setSearchTopic(searchValue);
      }

      console.log(type);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Fallback avatar images
  const fallbackAvatars = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  ];

  // Get a consistent fallback avatar based on user ID or random
  const getFallbackAvatar = useCallback(() => {
    if (user?.id) {
      const index = user.id.charCodeAt(0) % fallbackAvatars.length;
      return fallbackAvatars[index];
    }
    return fallbackAvatars[0];
  }, [user]);

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const response = await axiosIntense.get(`/users/email/${user.email}`);
        setUserProfile(response.data);
      } catch {
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.email]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!user?.email) return;

      try {
        const response = await axiosIntense.get(
          `/notifications/user/${user.email}`
        );
        setNotificationCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    // Set up polling for notifications
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user?.email]);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!user?.email) return;

      try {
        const response = await axiosIntense.get(
          `/messageUsers/unread-count/${user.email}`
        );
        setUnreadMessages(response.data.unreadCount || 0);
        setMessageNotifications(response.data.recentMessages || []);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadMessages();

    // Set up polling for new messages every 30 seconds
    const interval = setInterval(fetchUnreadMessages, 30000);

    return () => clearInterval(interval);
  }, [user?.email]);

  // Get user avatar - priority: userProfile -> auth user -> fallback
  const userAvatar = useMemo(() => {
    if (userProfile?.profileImage) {
      return userProfile.profileImage;
    }
    if (user?.profileImage) {
      return user.profileImage;
    }
    return getFallbackAvatar();
  }, [userProfile, user, getFallbackAvatar]);

  // Get user display name - priority: userProfile -> auth user -> default
  const userDisplayName = useMemo(() => {
    if (userProfile?.fullName) {
      return userProfile.fullName;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.name) {
      return user.name;
    }
    return "Guest User";
  }, [userProfile, user]);

  // Get user email
  const userEmail = useMemo(() => {
    return user?.email || "Sign in to your account";
  }, [user]);

  // Check if user is premium
  const isPremiumUser = useMemo(() => {
    return userProfile?.isPremium || userProfile?.role === "premium user";
  }, [userProfile]);

  // Fetch logo from API
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axiosIntense.get("/logo");
        setLogoData(response.data);
      } catch (error) {
        console.error("Failed to fetch logo:", error);
        setLogoData({ type: "text", text: "CC" });
      } finally {
        setLogoLoading(false);
      }
    };

    fetchLogo();
  }, []);

  // Minimal Logo Component
  const LogoComponent = useCallback(() => {
    if (logoLoading) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <span className="font-bold text-xl text-gray-900 hidden sm:block">
          CareerCrafter
        </span>
      </div>
    );
  }, [logoLoading]);

  // Set active nav based on current route
  useEffect(() => {
    const path = location.pathname;
    const navMap = {
      "/": "Home",
      "/network": "Network",
      "/jobs": "Jobs",
      "/messages": "Messages",
      "/notifications": "Notifications",
      "/profile": "Profile",
      "/create-resume": "Create Resume",
      "/check-resume": "Check Resume",
      "/ai-job-match": "AI Job Match",
      "/mock-interview": "Mock Interview",
      "/create-cv": "Create CV",
      "/business": "Business",
      "/premium": "Premium",
      "/settings": "Settings",
    };

    const matchedNav = Object.entries(navMap).find(([route]) => path === route);
    if (matchedNav) {
      setActiveNav(matchedNav[1]);
    } else {
      // Handle nested routes
      if (path.includes("/create-resume")) setActiveNav("Create Resume");
      else if (path.includes("/check-resume")) setActiveNav("Check Resume");
      else if (path.includes("/ai-job-match")) setActiveNav("AI Job Match");
      else if (path.includes("/mock-interview")) setActiveNav("Mock Interview");
      else if (path.includes("/create-cv")) setActiveNav("Create CV");
      else if (path.includes("/profile")) setActiveNav("Profile");
      else if (path.includes("/settings")) setActiveNav("Settings");
    }
  }, [location.pathname]);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearch(false);
    setShowProfileMenu(false);
    setShowAIToolsMenu(false);
  }, [location.pathname]);

  const handleProfileClick = useCallback(() => {
    if (user) {
      navigate("/profile");
    } else {
      Swal.fire({
        title: "Login Required",
        text: "You need to login first",
        icon: "warning",
        confirmButtonText: "Login",
        confirmButtonColor: "#2563eb",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/signin");
        }
      });
    }
  }, [user, navigate]);

  const handleDashboard = useCallback(() => {
    if (user) {
      navigate("/dashboard/user");
    } else {
      Swal.fire({
        title: "Login Required",
        text: "You need to login first",
        icon: "warning",
        confirmButtonText: "Login",
        confirmButtonColor: "#2563eb",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/signin");
        }
      });
    }
  }, [user, navigate]);

  const handleNavClick = useCallback(
    (navItem) => {
      setActiveNav(navItem);
      setIsMobileMenuOpen(false);
      setShowProfileMenu(false);
      setShowAIToolsMenu(false);

      const routeMap = {
        Home: "/",
        Network: "/network",
        Jobs: "/jobs",
        Messages: "/messages",
        Notifications: "/notifications",
        Business: "/business",
        Premium: "/premium",
        "Create Resume": "/create-resume",
        "Check Resume": "/check-resume",
        "AI Job Match": "/ai-job-match",
        "Mock Interview": "/mock-interview",
        "Create CV": "/create-cv",
        Profile: "/profile",
        Settings: "/settings",
      };

      const route = routeMap[navItem];
      if (route) {
        navigate(route);
      }
    },
    [navigate]
  );

  const handleAIToolClick = useCallback(
    (tool) => {
      handleNavClick(tool);
      setShowAIToolsMenu(false);
    },
    [handleNavClick]
  );

  const handleLogout = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        userLogOut();
        navigate("/");
      }
    });
  }, [userLogOut, navigate]);

  // Mark messages as read when visiting messages page
  const markMessagesAsRead = useCallback(async () => {
    if (!user?.email) return;

    try {
      await axiosIntense.post(`/messageUsers/mark-read/${user.email}`);
      setUnreadMessages(0);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [user?.email]);

  // Navigation items with dynamic notification counts
  const mainNavItems = useMemo(
    () => [
      { label: "Home", icon: Home, path: "/" },
      { label: "Network", icon: Users, path: "/network" },
      { label: "Jobs", icon: Briefcase, path: "/jobs" },
      {
        label: "Messages",
        icon: MessageCircle,
        path: "/messages",
        notification: unreadMessages,
      },
    ],
    [unreadMessages]
  );

  const aiToolsItems = useMemo(
    () => [
      { label: "Create Resume", icon: FileText, path: "/create-resume" },
      { label: "Check Resume", icon: FileCheck2, path: "/check-resume" },
      { label: "AI Job Match", icon: Target, path: "/ai-job-match" },
      { label: "Mock Interview", icon: Bot, path: "/mock-interview" },
      { label: "Create CV", icon: Bot, path: "/create-cv" },
    ],
    []
  );

  // Business and Premium items for desktop
  const businessPremiumItems = useMemo(
    () => [
      { label: "Business", icon: Building, path: "/business" },
      { label: "Premium", icon: Crown, path: "/premium" },
    ],
    []
  );

  const mobileNavItems = useMemo(
    () => [
      { label: "Home", icon: Home, path: "/" },
      { label: "Network", icon: Users, path: "/network" },
      { label: "Jobs", icon: Briefcase, path: "/jobs" },
      {
        label: "Messages",
        icon: MessageCircle,
        path: "/messages",
        notification: unreadMessages,
      },
      {
        label: "Notifications",
        icon: Bell,
        path: "/notifications",
        notification: 5,
      },
    ],
    [unreadMessages]
  );

  // Handle messages click - mark as read
  const handleMessagesClick = useCallback(() => {
    markMessagesAsRead();
    handleNavClick("Messages");
  }, [markMessagesAsRead, handleNavClick]);

  if (loading || profileLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="w-11/12 mx-auto px-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center cursor-pointer"
              onClick={() => handleNavClick("Home")}
            >
              <LogoComponent />
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs, peoples.."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-sm"
                  onKeyPress={handleSearch}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <DesktopNavItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={activeNav === item.label}
                  onClick={
                    item.label === "Messages"
                      ? handleMessagesClick
                      : () => handleNavClick(item.label)
                  }
                  notification={item.notification}
                />
              ))}

              {/* AI Tools Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center p-2 rounded-xl min-w-16 transition-colors ${
                    aiToolsItems.some((item) => activeNav === item.label)
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setShowAIToolsMenu(!showAIToolsMenu)}
                >
                  <div className="relative">
                    <Sparkles className="w-5 h-5" />
                    {aiToolsItems.some((item) => activeNav === item.label) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">AI Tools</span>
                </motion.button>

                <AnimatePresence>
                  {showAIToolsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {aiToolsItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleAIToolClick(item.label)}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                            activeNav === item.label
                              ? "bg-purple-50 text-purple-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Business and Premium Items */}
              {businessPremiumItems.map((item) => (
                <DesktopNavItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={activeNav === item.label}
                  onClick={() => handleNavClick(item.label)}
                />
              ))}

              {/* Notifications */}
              <DesktopNavItem
                label="Notifications"
                icon={Bell}
                active={activeNav === "Notifications"}
                onClick={() => handleNavClick("Notifications")}
                notification={5}
              />

              {/* Profile Menu */}
              <div className="relative">
                {user ? (
                  // ✅ If user is logged in → Show profile icon dropdown
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-2 p-2 rounded-xl transition-colors ${
                        activeNav === "Profile"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                      <div className="relative w-8 h-8">
                        {userProfile?.profileImage ? (
                          <img
                            src={userProfile.profileImage}
                            alt={userDisplayName}
                            className="w-8 h-8 rounded-full object-cover "
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getFallbackAvatar();
                            }}
                          />
                        ) : (
                          // Generate avatar from name initials
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold "
                            style={{
                              backgroundColor: stringToColor(
                                userDisplayName || "User"
                              ),
                            }}
                          >
                            {getInitials(userDisplayName || "U")}
                          </div>
                        )}

                        {/* Premium badge */}
                        {isPremiumUser && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Star className="w-2 h-2 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>

                    {/* Profile dropdown */}
                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              {/* Avatar display (image or initials) */}
                              <div className="relative w-8 h-8">
                                {userProfile?.profileImage ? (
                                  <img
                                    src={userProfile.profileImage}
                                    alt={userDisplayName}
                                    className="w-8 h-8 rounded-full object-cover "
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = getFallbackAvatar();
                                    }}
                                  />
                                ) : (
                                  // Generate avatar from name initials
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold "
                                    style={{
                                      backgroundColor: stringToColor(
                                        userDisplayName || "User"
                                      ),
                                    }}
                                  >
                                    {getInitials(userDisplayName || "U")}
                                  </div>
                                )}

                                {/* Premium badge */}
                                {isPremiumUser && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Star className="w-2 h-2 text-white fill-current" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {userDisplayName}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {userEmail}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="py-1">
                            <button
                              onClick={() => handleNavClick("Profile")}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>Your Profile</span>
                            </button>
                            <button
                              onClick={() => handleDashboard("dashboard")}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>Dashboard</span>
                            </button>
                          </div>

                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  // if user not found
                  <div className="w-full">
                   <button
  onClick={() => navigate("/auth/signin")}
  className="flex items-center justify-center gap-2 w-full px-3 py-2.5 
             bg-blue-600 text-white text-sm font-medium rounded-lg 
             shadow-md hover:bg-blue-700 hover:shadow-lg 
             active:scale-95 transition-all duration-300"
>
  <LogIn className="w-4 h-4" />
  <span>Sign In</span>
</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="lg:hidden w-full bg-white/80 border-b border-gray-100 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu Button & Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleNavClick("Home")}
              >
                <LogoComponent />
              </div>
            </div>

            {/* Right: Search & Notifications */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={handleMessagesClick}
              >
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search jobs, people, companies..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                    onKeyPress={handleSearch}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <LogoComponent />
                  </div>
                </div>

                {/* Profile Section */}
                <div
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleProfileClick}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={userAvatar}
                        alt={userDisplayName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getFallbackAvatar();
                        }}
                      />
                      {isPremiumUser && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Crown className="w-2 h-2 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {userDisplayName}
                        </h3>
                        {isPremiumUser && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {user ? "View your profile" : "Sign in to your account"}
                      </p>
                      {userProfile?.aiCredits && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {userProfile.aiCredits.toLocaleString()} AI Credits
                        </p>
                      )}
                      {unreadMessages > 0 && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          {unreadMessages} unread message
                          {unreadMessages !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Settings & Logout - Only show for logged in users */}
                {user && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      Account
                    </h4>
                    <div className="space-y-1">
                      <MobileNavItem
                        label="Settings"
                        icon={Settings}
                        active={activeNav === "Settings"}
                        onClick={() => handleNavClick("Settings")}
                      />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Sections */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {/* Main Navigation */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      Menu
                    </h4>
                    <div className="space-y-1">
                      {mainNavItems.map((item) => (
                        <MobileNavItem
                          key={item.label}
                          {...item}
                          active={activeNav === item.label}
                          onClick={
                            item.label === "Messages"
                              ? handleMessagesClick
                              : () => handleNavClick(item.label)
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* AI Tools */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      AI Tools
                    </h4>
                    <div className="space-y-1">
                      {aiToolsItems.map((item) => (
                        <MobileNavItem
                          key={item.label}
                          {...item}
                          active={activeNav === item.label}
                          onClick={() => handleNavClick(item.label)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* More */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      More
                    </h4>
                    <div className="space-y-1">
                      <MobileNavItem
                        label="Business"
                        icon={Building}
                        active={activeNav === "Business"}
                        onClick={() => handleNavClick("Business")}
                      />
                      <MobileNavItem
                        label="Premium"
                        icon={Crown}
                        active={activeNav === "Premium"}
                        onClick={() => handleNavClick("Premium")}
                        premium
                      />
                    </div>
                  </div>

                  {/* Settings & Logout */}
                  {user && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Account
                      </h4>
                      <div className="space-y-1">
                        <MobileNavItem
                          label="Settings"
                          icon={Settings}
                          active={activeNav === "Settings"}
                          onClick={() => handleNavClick("Settings")}
                        />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => (
            <MobileBottomNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.label}
              onClick={
                item.label === "Messages"
                  ? handleMessagesClick
                  : () => handleNavClick(item.label)
              }
              notification={item.notification}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

// Desktop Nav Item Component
const DesktopNavItem = ({
  label,
  icon: Icon,
  active,
  onClick,
  notification,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`relative flex flex-col items-center p-2 rounded-xl min-w-16 transition-colors ${
      active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {notification > 0 && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
      )}
    </div>
    <span className="text-xs mt-1 font-medium">{label}</span>
  </motion.button>
);

// Mobile Nav Item Component
const MobileNavItem = ({ label, icon: Icon, active, onClick, premium }) => (
  <button
    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
      active
        ? premium
          ? "bg-amber-50 text-amber-600"
          : "bg-blue-50 text-blue-600"
        : "text-gray-700 hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
    {premium && <Crown className="w-4 h-4 text-amber-500 ml-auto" />}
  </button>
);

// Mobile Bottom Nav Item Component
const MobileBottomNavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  notification,
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className={`relative flex flex-col items-center p-2 rounded-xl flex-1 transition-colors ${
      active ? "text-blue-600" : "text-gray-600"
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {notification > 0 && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
      )}
    </div>
    <span className="text-xs mt-1">{label}</span>
  </motion.button>
);

export default Navbar;
