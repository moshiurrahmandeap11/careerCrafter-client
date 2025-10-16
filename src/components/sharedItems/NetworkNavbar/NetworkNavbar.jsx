import React from "react";
import { NavLink } from "react-router";
import { Clock3 } from "lucide-react";

const NetworkNavbar = () => {
  return (
    <nav>
      <ul className="flex flex-col items-center gap-4">

        {/* Connection nav */}
        <li className="">
          <NavLink
            to="/network"
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
                <Clock3 className="text-blue-500" />
                <div>
                  <h1 className="font-bold text-gray-800">My Connection</h1>
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
                <Clock3 className="text-blue-500" />
                <div>
                  <h1 className="font-bold text-gray-800">My Connection</h1>
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
                <Clock3 className="text-blue-500" />
                <div>
                  <h1 className="font-bold text-gray-800">My Connection</h1>
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
                <Clock3 className="text-blue-500" />
                <div>
                  <h1 className="font-bold text-gray-800">My Connection</h1>
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
      </ul>
    </nav>
  );
};

export default NetworkNavbar;
