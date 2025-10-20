"use client";

import React from "react";
import StoreProvider from "./lib/redux/StoreProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StoreProvider>
  );
};

export { Providers };
