import type { UseLoadScriptOptions } from "@react-google-maps/api";

export const LENDER_GOOGLE_MAPS_LOADER_OPTIONS: UseLoadScriptOptions = {
  id: "lender-google-maps-loader",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
};
