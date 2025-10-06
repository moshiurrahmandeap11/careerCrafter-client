import React from 'react';
import { Outlet } from 'react-router';

const BusinessLayout = () => {
    return (
        <div>
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    );
};

export default BusinessLayout;