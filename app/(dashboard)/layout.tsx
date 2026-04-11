import React from "react";
import "@/styles/globals.css";
import DashboardNavigation from "./_components/DashboardNavigation";
import AuthGuard from "@/Provider/AuthGard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <AuthGuard>
        <DashboardNavigation>{children}</DashboardNavigation>
      </AuthGuard>
    </main>
  );
};

export default layout;
