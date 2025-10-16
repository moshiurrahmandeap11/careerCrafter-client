import React from "react";
import { NavLink } from "react-router";
import { Clock3, Sparkles, UserCheck, UsersRound } from "lucide-react";

const NetworkNavbar = () => {
  return (
    <nav>
      <ul className="flex flex-col  gap-4">

        {/* Connection nav */}
        <li className="">
          <NavLink
            to="/network"
            end
            className={({ isActive }) =>
              `block transition-all duration-300 rounded-lg px-4 py-3 
         ${
           isActive
             ? "bg-white shadow-md border-l-4 border-blue-500"
             : "bg-transparent hover:bg-gray-50"
         }`
            }
          >
            <div className="flex gap-20 items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="text-gray-600"/>
                <div>
                  <h1 className="font-bold text-gray-800">My Connections</h1>
                  <p className="text-sm text-gray-500">
                    Manage your professional network
                  </p>
                </div>
              </div>
              <h1 className="font-bold px-4 py-2 text-center rounded-full bg-gray-200 text-gray-700">
                0
              </h1>
            </div>
          </NavLink>
        </li>


            {/* pending nav */}
        <li className="">
          <NavLink
            to="/network/pending-connection"
            className={({ isActive }) =>
              `block transition-all duration-300 rounded-lg px-4 py-3 
         ${
           isActive
             ? "bg-white shadow-md border-l-4 border-blue-500"
             : "bg-transparent hover:bg-gray-50"
         }`
            }
          >
            <div className="flex gap-20 items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock3 className="text-gray-600" />
                <div>
                  <h1 className="font-bold text-gray-800">Pending Invitations</h1>
                  <p className="text-sm text-gray-500">
                    Reviwe connections requests
                  </p>
                </div>
              </div>
              <h1 className="font-bold px-4 py-2 text-center rounded-full bg-gray-200 text-gray-700">
                0
              </h1>
            </div>
          </NavLink>
        </li>

       {/* suggetion nav */}
        <li className="">
          <NavLink
            to="/network/suggetion-connection"
            className={({ isActive }) =>
              `block transition-all duration-300 rounded-lg px-4 py-3 
         ${
           isActive
             ? "bg-white shadow-md border-l-4 border-blue-500"
             : "bg-transparent hover:bg-gray-50"
         }`
            }
          >
            <div className="flex gap-20 items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-gray-600"/>
                <div>
                  <h1 className="font-bold text-gray-800">Suggestions</h1>
                  <p className="text-sm text-gray-500">
                    People you may know
                  </p>
                </div>
              </div>
              <h1 className="font-bold px-4 py-2 text-center rounded-full bg-gray-200 text-gray-700">
                0
              </h1>
            </div>
          </NavLink>
        </li>

          {/* all user nav */}
        <li className="">
          <NavLink
            to="/network/all-user"
            className={({ isActive }) =>
              `block transition-all duration-300 rounded-lg px-4 py-3 
         ${
           isActive
             ? "bg-white shadow-md border-l-4 border-blue-500"
             : "bg-transparent hover:bg-gray-50"
         }`
            }
          >
            <div className="flex gap-20 items-center justify-between">
              <div className="flex items-center gap-3">
                <UsersRound  className="text-gray-600"/>
                <div>
                  <h1 className="font-bold text-gray-800">All user</h1>
                  <p className="text-sm text-gray-500">
                    Browse all users and connect
                  </p>
                </div>
              </div>
              <h1 className="font-bold px-4 py-2 text-center rounded-full bg-gray-200 text-gray-700">
                0
              </h1>
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NetworkNavbar;
