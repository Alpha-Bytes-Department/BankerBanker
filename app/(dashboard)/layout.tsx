import React from 'react';
import '@/styles/globals.css';
import DashboardNavigation from './_components/DashboardNavigation';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <DashboardNavigation >
                {children}
            </DashboardNavigation>
        </main>
    );
};

export default layout;