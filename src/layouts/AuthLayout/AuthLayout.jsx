import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/sharedItems/Navbar/Navbar';

const AuthLayout = () => {
    return (
        <div>
            <nav className='sticky top-0 z-50 shadow-md'><Navbar></Navbar></nav>
            <Outlet></Outlet>
        </div>
    );
};

export default AuthLayout;