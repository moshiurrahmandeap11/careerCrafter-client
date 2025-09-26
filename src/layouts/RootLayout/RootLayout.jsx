import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/sharedItems/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div>
            <nav className='sticky top-0 z-50 shadow-md'><Navbar></Navbar></nav>
            <main><Outlet></Outlet></main>
            <footer></footer>
        </div>
    );
};

export default RootLayout;