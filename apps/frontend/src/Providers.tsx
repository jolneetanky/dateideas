"use client";

import React from "react";
import StoreProvider from "./lib/redux/StoreProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export { Providers };
