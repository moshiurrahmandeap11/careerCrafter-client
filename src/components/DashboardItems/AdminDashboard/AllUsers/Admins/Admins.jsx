import React, { useEffect, useState } from "react";

import { Loader2, ShieldCheck } from "lucide-react";
import axiosIntense from "../../../../../hooks/AxiosIntense/axiosIntense";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch only admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axiosIntense.get("/users");
        const adminsOnly = res.data.filter((user) => user.role === "admin");
        setAdmins(adminsOnly);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <section className="py-10 px-4 sm:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-red-600" /> Admin Panel
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Total: {admins.length} Admin{admins.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-red-600 w-8 h-8" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p>No admins found 😢</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-gray-100">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin, index) => (
                  <tr
                    key={admin._id}
                    className="border-b border-gray-100 hover:bg-red-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>

                    {/* Admin Info */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          admin.profileImage ||
                          "https://i.postimg.cc/tJsz3cBF/boy.png"
                        }
                        alt={admin.fullName}
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-semibold text-gray-800">
                        {admin.fullName || "Unknown Admin"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString() || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        {admin.role}
                      </span>
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

export default Admins;
