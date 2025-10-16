import React from 'react';
import { Outlet } from 'react-router';
import NetworkNavbar from '../../components/sharedItems/NetworkNavbar/NetworkNavbar';

const MyNetwork = ({children}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20'>
      <div className='w-11/12 mx-auto'>
           
        {/* nework heading */}

        <div className="">
          <h1 className='text-4xl font-bold'>My Network</h1>
          <p className='text-gray-600 text-sm mt-2'> Grow and manage your professional connections</p>
        </div>

      <div className='flex gap-8 mt-20'>
        <div className=''>
         <NetworkNavbar></NetworkNavbar>
      </div>

      <div>
          <Outlet>
             {
              children
             }
          </Outlet>
      </div>
      </div>

      </div>
      
    </div>
  );
}

export default MyNetwork;