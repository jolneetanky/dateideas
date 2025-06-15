"use client";

import { createContext, useContext, useState, JSX } from "react";

// Define context
const GeneratedIdeasPageContext = createContext({
  // default values; fallback in case eg. some component outside the context tree tries to consume the context
  page: 0,
  changePage: (_pg: number) => {},
});

// Define provider
const GeneratedIdeasPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // initial values
  //   const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(0);

  const changePage = (pg: number) => {
    setPage(pg);
  };

  return (
    <GeneratedIdeasPageContext.Provider
      value={{
        page,
        changePage,
      }}
    >
      {children}
    </GeneratedIdeasPageContext.Provider>
  );
};

// Hook to access context
const useGeneratedIdeasPageCtx = () => {
  return useContext(GeneratedIdeasPageContext);
};

export { useGeneratedIdeasPageCtx, GeneratedIdeasPageProvider };
