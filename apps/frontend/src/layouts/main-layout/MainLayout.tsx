"use client";

import { Sidebar } from "@/layouts/main-layout/Sidebar";
import classes from "./styles/MainLayout.module.css";
import { IsSidebarOpenProvider } from "./contexts/IsSidebarOpenContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${classes.mainLayout}`}>
      <IsSidebarOpenProvider>
        <Sidebar />
      </IsSidebarOpenProvider>
      {children}
    </div>
  );
};

export default MainLayout;
