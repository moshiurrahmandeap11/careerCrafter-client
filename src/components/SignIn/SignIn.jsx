import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaGoogle,
  FaFacebook,
  FaGithub,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import useAuth from "../../hooks/UseAuth/useAuth";
import Swal from "sweetalert2";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import { motion, AnimatePresence } from "framer-motion";

const SignIn = () => {
  const {
    user,
    loading,
    googleLogin,
    facebookLogin,
    resetPassword,
    githubLogin,
    userLogin,
  } = useAuth();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (user && !loading) {
      navigate(-1);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔹 Handle Social Logins
  const handleSocialLogin = async (loginFn, providerName) => {
    try {
      const userCredential = await loginFn();
      const currentUser = userCredential.user;
      const fullName =
        currentUser.displayName || currentUser.email.split("@")[0] || "User";

      try {
        await axiosIntense.post("/users", {
          fullName,
          email: currentUser.email,
          role: "free user",
          createdAt: new Date().toISOString(),
          creationDate: new Date().toLocaleDateString(),
        });
      } catch (error) {
        if (error.response?.status !== 400) throw error;
      }

      Swal.fire({
        icon: "success",
        title: `Signed in with ${providerName}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate("/auth/where-listen"));
    } catch (error) {
      console.error(`${providerName} login failed:`, error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${providerName} login failed. Try again!`,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleGoogleLogin = () => handleSocialLogin(googleLogin, "Google");
  const handleFacebookLogin = () =>
    handleSocialLogin(facebookLogin, "Facebook");
  const handleGithubLogin = () => handleSocialLogin(githubLogin, "GitHub");

  // 🔹 Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter email & password",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      await userLogin(formData.email, formData.password);

      Swal.fire({
        icon: "success",
        title: "Signed in successfully!",
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      navigate("/");
    } catch (error) {
      console.error("Sign in failed:", error);
      Swal.fire({
        icon: "error",
        title: "Sign in failed",
        text: error.message || "Invalid credentials or network error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // 🔹 Handle Password Reset
  const handleResetPassword = async () => {
    if (!resetEmail) {
      Swal.fire({
        icon: "warning",
        title: "Enter your email",
        text: "Please provide your email address",
      });
      return;
    }

    try {
      await resetPassword(resetEmail);
      Swal.fire({
        icon: "success",
        title: "Password reset email sent!",
        text: "Check your inbox for the reset link.",
        timer: 2000,
        showConfirmButton: false,
      });
      setShowModal(false);
      setResetEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reset failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 relative">
      {/* ===== Sign In Card ===== */}
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        {/* Social Login */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleGoogleLogin}
            className="p-2 cursor-pointer bg-blue-600 text-white rounded-full hover:bg-blue-700 duration-200 transition-colors"
          >
            <FaGoogle className="w-6 h-6" />
          </button>
          <button
            onClick={handleFacebookLogin}
            className="p-2 cursor-pointer bg-blue-600 text-white rounded-full hover:bg-blue-700 duration-200 transition-colors"
          >
            <FaFacebook className="w-6 h-6" />
          </button>
          <button
            onClick={handleGithubLogin}
            className="p-2 cursor-pointer bg-blue-600 text-white rounded-full hover:bg-blue-700 duration-200 transition-colors"
          >
            <FaGithub className="w-6 h-6" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-colors"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 cursor-pointer w-4 text-red-700 border-gray-300 rounded focus:ring-2 focus:ring-red-700 transition-colors"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember Me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-blue-600 hover:underline"
              >
                Forget Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-red-300 transition-colors duration-200 text-sm font-medium"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* ===== Forget Password Modal ===== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50"
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-lg p-6 w-80 shadow-xl"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Reset Password
              </h2>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-700"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignIn;
