import React, {  useState } from "react";
import { Home, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import useAuth from "../../../hooks/UseAuth/useAuth";
import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import Swal from "sweetalert2";

const Hire = () => {
  const [activeTab, setActiveTab] = useState("post"); // "post" or "view"
  

  const { user } = useAuth();
  const axiosPublic=axiosIntense

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newPost = {
      
      title: form.title.value,
      
      location: form.location.value,
      type: form.type.value,
      skills: form.skills.value,
      salary: form.salary.value,
      description: form.description.value,
      ContactEmail: form.email.value,
      email:user?.email,
      name:user?.displayName,
      date:new Date()
      

    };

    axiosPublic.post('/hired-post/added-hired-post', newPost)
  .then(res => {
    if(res.data.insertedId){
        Swal.fire({
                            icon: 'success',
                            title: 'Connection Removed!',
                            text: `post successfully`,
                            timer: 2000,
                            showConfirmButton: true
                        });
    }
    form.reset();
  })
  .catch(err => {
    console.error('Error saving post:', err);
  });
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Home className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Career Crafter
                </h1>
                <p className="text-xs text-gray-500">Hire Portal</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("post")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "post"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Post Hire Request
              </button>
              <button
                onClick={() => setActiveTab("view")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === "view"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                See Hire Posts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto p-6">
        {activeTab === "post" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🧾 Post a Hire Request
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                type="text"
                required
                placeholder="Job Title (e.g., Frontend Developer)"
                className="border p-2 rounded-md w-full"
              />
              
              <input
                name="location"
                type="text"
                placeholder="Location (e.g., Dhaka / Remote)"
                className="border p-2 rounded-md w-full"
              />
              <select
                name="type"
                className="border p-2 rounded-md w-full"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select Employment Type
                </option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
              <input
                name="skills"
                type="text"
                placeholder="Required Skills (e.g., React, Node.js)"
                className="border p-2 rounded-md w-full"
              />
              <input
                name="salary"
                type="text"
                placeholder="Salary Range (e.g., 30k-50k BDT)"
                className="border  p-2 rounded-md w-full"
              />
              <input
                name="email"
                type="email"
                placeholder="Contact Email"
                className="border p-2 rounded-md w-full"
              />
             
            </div>

            <textarea
              name="description"
              rows="4"
              placeholder="Job Description..."
              className="border p-2 rounded-md w-full"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Post Hire Request
            </button>
          </form>
        )}

        {activeTab === "view" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📋 Available Hire Posts
            </h2>

           
          </div>
        )}
      </div>
    </div>
  );
};

export default Hire;
