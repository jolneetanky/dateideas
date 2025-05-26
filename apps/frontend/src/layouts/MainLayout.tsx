import Sidebar from "@/common/components/Sidebar";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="MainLayout">
      <Sidebar />
      {children}
    </div>
  );
};

export default MainLayout;
