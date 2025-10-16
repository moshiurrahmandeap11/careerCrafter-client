import React from 'react';
import { Outlet } from 'react-router';
import NetworkNavbar from '../../components/sharedItems/NetworkNavbar/NetworkNavbar';

const MyNetwork = ({children}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <div className='w-11/12 mx-auto flex gap-2'>

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
  );
}

export default MyNetwork;