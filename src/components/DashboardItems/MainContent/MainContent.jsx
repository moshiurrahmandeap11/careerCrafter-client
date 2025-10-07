import React from "react";
import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";
import Settings from "../AdminDashboard/Settings/Settings";
import SiteSettings from "../AdminDashboard/Settings/SiteSettings/SiteSettings";
import AllUsers from "../AdminDashboard/AllUsers/AllUsers";
import Admins from "../AdminDashboard/AllUsers/Admins/Admins";
import Messages from "../AdminDashboard/Messages/Messages";
import JobsAdmin from "../AdminDashboard/JobsAdmin/JobsAdmin";
import ApplicationsAdmin from "../AdminDashboard/ApplicationsAdmin/ApplicationsAdmin";

const MainContent = ({ activeRoute }) => {
  const renderContent = () => {
    switch (activeRoute) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Dashboard Overview
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Total Users
                    </p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                      12,458
                    </h3>
                    <p className="text-green-600 text-sm mt-2">
                      +12% from last month
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-blue-500 opacity-80" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Active Jobs
                    </p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                      3,241
                    </h3>
                    <p className="text-green-600 text-sm mt-2">
                      +8% from last month
                    </p>
                  </div>
                  <Briefcase className="w-10 h-10 text-purple-500 opacity-80" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Applications
                    </p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                      8,392
                    </h3>
                    <p className="text-green-600 text-sm mt-2">
                      +23% from last month
                    </p>
                  </div>
                  <FileText className="w-10 h-10 text-green-500 opacity-80" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Success Rate
                    </p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                      87%
                    </h3>
                    <p className="text-green-600 text-sm mt-2">
                      +5% from last month
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-500 opacity-80" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        U{i}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          New user registered
                        </p>
                        <p className="text-sm text-slate-500">{i} hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Popular Jobs
                </h3>
                <div className="space-y-4">
                  {[
                    "Senior Developer",
                    "UI/UX Designer",
                    "Product Manager",
                    "Data Analyst",
                  ].map((job, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{job}</p>
                        <p className="text-sm text-slate-500">
                          {Math.floor(Math.random() * 100) + 50} applications
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              User Management
            </h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-slate-600">
                Manage all registered users, view their profiles, and monitor
                activity.
              </p>
            </div>
          </div>
        );

      case "all-users":
        return (
          <div>
            <AllUsers></AllUsers>
          </div>
        );

      case "admins":
        return (
          <div>
            <Admins></Admins>
          </div>
        );

      case "jobs":
        return (
          <div>
            <JobsAdmin></JobsAdmin>
          </div>
        );

      case "applications":
        return (
          <div>
            <ApplicationsAdmin></ApplicationsAdmin>
          </div>
        );

      case "analytics":
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Analytics
            </h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-slate-600">
                View detailed analytics and reports on platform performance.
              </p>
            </div>
          </div>
        );

      case "messages":
        return (
          <div>
            <Messages></Messages>
          </div>
        );
        

      case "settings":
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <Settings></Settings>
            </div>
          </div>
        );
      case "site-settings":
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Site Settings Settings
            </h1>
            <div className="bg-white rounded-xl shadow-md p-6">
              <SiteSettings></SiteSettings>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="p-6 md:p-8">{renderContent()}</div>;
};

export default MainContent;
