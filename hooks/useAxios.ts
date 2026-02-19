"use client";

import { createContext, useContext } from "react";
import type { AxiosInstance } from "axios";

//========== Axios Context ===========
export const AxiosContext = createContext<AxiosInstance | null>(null);

//========== Custom Hook to Use Axios Instance ===========
export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};
