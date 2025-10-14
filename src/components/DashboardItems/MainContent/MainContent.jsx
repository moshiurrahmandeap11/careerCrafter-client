import React, { useState, useEffect } from "react";
import { Users, Briefcase, FileText, TrendingUp, MessageCircle } from "lucide-react";
import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import Settings from "../AdminDashboard/Settings/Settings";
import SiteSettings from "../AdminDashboard/Settings/SiteSettings/SiteSettings";
import AllUsers from "../AdminDashboard/AllUsers/AllUsers";
import Admins from "../AdminDashboard/AllUsers/Admins/Admins";
import Messages from "../AdminDashboard/Messages/Messages";
import JobsAdmin from "../AdminDashboard/JobsAdmin/JobsAdmin";
import ApplicationsAdmin from "../AdminDashboard/ApplicationsAdmin/ApplicationsAdmin";

const MainContent = ({ activeRoute }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    successRate: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [popularJobs, setPopularJobs] = useState([]);

  useEffect(() => {
    if (activeRoute === "dashboard") {
      fetchDashboardData();
    }
  }, [activeRoute]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, jobsRes, applicationsRes, messagesRes] = await Promise.all([
        axiosIntense.get('/users'),
        axiosIntense.get('/jobs'),
        axiosIntense.get('/applications'),
        axiosIntense.get('/messageUsers/allMessages')
      ]);

      // Calculate stats
      const totalUsers = usersRes.data?.length || 0;
      const activeJobs = jobsRes.data?.data?.length || 0;
      const totalApplications = applicationsRes.data?.data?.length || 0;
      const totalMessages = messagesRes.data?.messages?.length || 0;

      // Calculate success rate (applications per job ratio)
      const successRate = activeJobs > 0 ? Math.min(100, Math.round((totalApplications / activeJobs) * 10)) : 0;

      // Get recent activities (last 4 users)
      const recentUsers = usersRes.data?.slice(-4).reverse() || [];
      const activities = recentUsers.map(user => ({
        type: 'user_registered',
        title: 'New user registered',
        description: `${user.fullName || user.email} joined`,
        time: user.createdAt || new Date().toISOString(),
        user: user
      }));

      // Get popular jobs (jobs with most applications)
      const jobsWithApplications = jobsRes.data?.data || [];
      const popular = jobsWithApplications
        .sort((a, b) => (b.applications || 0) - (a.applications || 0))
        .slice(0, 4)
        .map(job => ({
          title: job.title,
          applications: job.applications || 0,
          company: job.company,
          status: job.status
        }));

      setStats({
        totalUsers,
        activeJobs,
        totalApplications,
        successRate,
        totalMessages
      });

      setRecentActivities(activities);
      setPopularJobs(popular);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const renderContent = () => {
    switch (activeRoute) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              Dashboard Overview
            </h1>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">
                          Total Users
                        </p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">
                          {stats.totalUsers.toLocaleString()}
                        </h3>
                        <p className="text-green-600 text-sm mt-2">
                          Registered users
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
                          {stats.activeJobs.toLocaleString()}
                        </h3>
                        <p className="text-green-600 text-sm mt-2">
                          Job listings
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
                          {stats.totalApplications.toLocaleString()}
                        </h3>
                        <p className="text-green-600 text-sm mt-2">
                          Total submissions
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
                          {stats.successRate}%
                        </h3>
                        <p className="text-green-600 text-sm mt-2">
                          Applications per job
                        </p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-orange-500 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">
                          Total Messages
                        </p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">
                          {stats.totalMessages.toLocaleString()}
                        </h3>
                        <p className="text-green-600 text-sm mt-2">
                          User conversations
                        </p>
                      </div>
                      <MessageCircle className="w-10 h-10 text-red-500 opacity-80" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                      Recent Activities
                    </h3>
                    <div className="space-y-4">
                      {recentActivities.length > 0 ? (
                        recentActivities.map((activity, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {activity.user?.fullName?.charAt(0) || activity.user?.email?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800">
                                {activity.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                {activity.description} • {formatTimeAgo(activity.time)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-4">No recent activities</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                      Popular Jobs
                    </h3>
                    <div className="space-y-4">
                      {popularJobs.length > 0 ? (
                        popularJobs.map((job, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0"
                          >
                            <div>
                              <p className="font-medium text-slate-800">{job.title}</p>
                              <p className="text-sm text-slate-500">
                                {job.applications} applications • {job.company}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === 'active' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {job.status || 'Active'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-4">No jobs available</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
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
              Site Settings
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