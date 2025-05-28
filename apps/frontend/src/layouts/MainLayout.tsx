import NavBar from "@/common/components/NavBar";
import Sidebar from "@/common/components/Sidebar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <NavBar className="h-[5%]" />
      {children}
    </div>
  );
};

export default MainLayout;
