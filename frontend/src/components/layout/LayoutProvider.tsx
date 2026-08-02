"use client";

import React, { ReactNode } from "react";
import { useLenis } from "@/hooks";

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  // Initialize smooth scroll
  useLenis();

  return <>{children}</>;
};
