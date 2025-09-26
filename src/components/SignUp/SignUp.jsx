import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import useAuth from "../../hooks/UseAuth/useAuth";
import Loader from "../sharedItems/Loader/Loader";
import { FaEye, FaEyeSlash, FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";


const SignUp = () => {
  const { user, loading, googleLogin, facebookLogin, githubLogin, createUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  useEffect(() => {
    if (user && !loading) navigate("/where-listen");
  }, [user, loading, navigate]);

  // ---------------- Social Login Handlers ----------------
  const handleSocialLogin = async (loginFn, providerName) => {
    try {
      const userCredential = await loginFn();
      const currentUser = userCredential.user;
      const fullName = currentUser.displayName || currentUser.email.split("@")[0] || "User";

      // Post user data to server
      await axiosIntense.post("/v1/users", {
        fullName,
        email: currentUser.email,
        role: "free user",
        createdAt: new Date().toISOString(),
        creationDate: new Date().toLocaleDateString(),
      });

      Swal.fire({
        icon: "success",
        title: `Signed up with ${providerName}`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate("/where-listen"));
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

  // ---------------- Email/Password Signup ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      Swal.fire({ icon: "warning", title: "Accept terms", confirmButtonColor: "#dc2626" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords do not match", confirmButtonColor: "#dc2626" });
      return;
    }

    try {
      const userCredential = await createUser(formData.email, formData.password);
      const currentUser = userCredential.user;

      // Post user data to server
      await axiosIntense.post("/v1/users", {
        fullName: formData.fullName,
        email: currentUser.email,
        role: "free user",
        createdAt: new Date().toISOString(),
        creationDate: new Date().toLocaleDateString(),
      });

      Swal.fire({
        icon: "success",
        title: "Signed up successfully!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => navigate("/where-listen"));
    } catch (error) {
      console.error("Signup failed:", error);
      Swal.fire({
        icon: "error",
        title: "Signup failed",
        text: "Try again!",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        {/* Social Buttons */}
        <div className="flex justify-center space-x-4">
          <button onClick={handleGoogleLogin} className="p-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors">
            <FaGoogle className="w-6 h-6" />
          </button>
          <button onClick={handleFacebookLogin} className="p-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors">
            <FaFacebook className="w-6 h-6" />
          </button>
          <button onClick={handleGithubLogin} className="p-2 bg-red-700 text-white rounded-full hover:bg-red-800 transition-colors">
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

        {/* Email/Password Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                required
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} className="h-4 w-4 cursor-pointer text-red-700 border-gray-300 rounded focus:ring-2 focus:ring-red-700" required />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="/terms" className="text-red-700 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-red-700 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="w-full px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors">Submit</button>

          <p className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/auth/signin" className="text-red-700 hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
