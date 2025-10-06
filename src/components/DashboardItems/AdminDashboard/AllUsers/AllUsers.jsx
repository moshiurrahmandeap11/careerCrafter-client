import React, { useEffect, useState } from "react";
import axiosIntense from "../../../../hooks/AxiosIntense/axiosIntense";
import { Loader2, Users } from "lucide-react";
import Swal from "sweetalert2";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch users
  useEffect(() => {
    const tryFetching = async () => {
      try {
        const response = await axiosIntense.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    tryFetching();
  }, []);

  // handle action select
  const handleAction = async (action, userId) => {
    if (action === "promote") {
      Swal.fire({
        icon: "info",
        title: "Coming Soon 🚀",
        text: "Promote will be available soon!",
        confirmButtonColor: "#e11d48",
      });
    } else if (action === "delete") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e11d48",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await axiosIntense.delete(`/users/${userId}`);
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted successfully.",
            confirmButtonColor: "#e11d48",
            timer: 1500,
          });
        } catch (error) {
          console.error("Delete failed:", error);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Something went wrong while deleting.",
            confirmButtonColor: "#e11d48",
          });
        }
      }
    }
  };

  return (
    <section className="py-10 px-4 sm:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-red-600" /> All Users
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Total: {users.length} users
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-red-600 w-8 h-8" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>No users found 😢</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-gray-100">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-red-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>

                    {/* user info */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          user.profileImage ||
                          `https://i.postimg.cc/tJsz3cBF/boy.png`
                        }
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-semibold text-gray-800">
                        {user.fullName || "Unknown User"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : user.role === "moderator"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString() || "N/A"}
                    </td>

                    {/* Actions Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        onChange={(e) => handleAction(e.target.value, user._id)}
                        defaultValue=""
                        className="border border-gray-300 text-gray-700 text-sm rounded-md px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-red-400"
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="promote">Promote</option>
                        <option value="delete">Delete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllUsers;
