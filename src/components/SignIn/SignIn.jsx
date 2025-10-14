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

const SignIn = () => {
  const { user, loading, googleLogin, facebookLogin, githubLogin, userLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (user && !loading) {
      navigate(-1); // Redirect to previous page if user is logged in
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

    const handleSocialLogin = async (loginFn, providerName) => {
  try {
    const userCredential = await loginFn();
    const currentUser = userCredential.user;
    const fullName =
      currentUser.displayName || currentUser.email.split("@")[0] || "User";

    try {
      // Try to create user in DB
      await axiosIntense.post("/users", {
        fullName,
        email: currentUser.email,
        role: "free user",
        createdAt: new Date().toISOString(),
        creationDate: new Date().toLocaleDateString(),
      });
    } catch (error) {
      // If already exists, it's fine
      if (error.response?.status !== 400) {
        throw error;
      }
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
  const handleFacebookLogin = () => handleSocialLogin(facebookLogin, "Facebook");
  const handleGithubLogin = () => handleSocialLogin(githubLogin, "GitHub");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
    // Firebase login via useAuth
    await userLogin(formData.email, formData.password);

    Swal.fire({
      icon: "success",
      title: "Signed in successfully!",
      timer: 1000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    // Redirect to home
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        {/* Social Login */}
        <div className="flex justify-center space-x-4">
          <button onClick={handleGoogleLogin} className="p-2 cursor-pointer bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors">
            <FaGoogle className="w-6 h-6" />
          </button>
          <button onClick={handleFacebookLogin} className="p-2 cursor-pointer bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors">
            <FaFacebook className="w-6 h-6" />
          </button>
          <button onClick={handleGithubLogin} className="p-2 cursor-pointer bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors">
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
              <a
                href="/forget-password"
                className="text-red-700 hover:underline"
              >
                Forget Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition-colors duration-200 text-sm font-medium"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/auth/signup" className="text-red-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
