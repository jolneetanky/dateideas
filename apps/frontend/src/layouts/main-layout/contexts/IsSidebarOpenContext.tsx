"use client";

import { initLogger } from "@/lib/logger";
import { createContext, useContext, useState, JSX } from "react";

// Define context
const IsSidebarOpenContext = createContext({
  // default values; fallback in case eg. some component outside the context tree tries to consume the context
  isSidebarOpen: false,
  toggleSidebarOpen: () => {},
  closeSidebar: () => {},
});

// Define provider
const IsSidebarOpenProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // initial values
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebarOpen = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <IsSidebarOpenContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebarOpen,
        closeSidebar,
      }}
    >
      {children}
    </IsSidebarOpenContext.Provider>
  );
};

// Hook to access context
const useIsSidebarOpen = () => {
  const log = initLogger("[useIsSidebarOpen]");
  log.info("heyyy");
  return useContext(IsSidebarOpenContext);
};

export { IsSidebarOpenProvider, useIsSidebarOpen };
