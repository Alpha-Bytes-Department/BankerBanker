import React from "react";
import "@/styles/globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default layout;
