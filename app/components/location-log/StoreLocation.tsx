import React, { useEffect } from "react";
import { getCurrentPositionAsync, Accuracy } from "expo-location";
import * as FileSystem from "expo-file-system";
import moment from "moment";
import { useLocationPermission } from "./useLocationPermission";
import { appendLogFile } from "./utils/log";

/**
 * Stores the location every 10 seconds (returns null)
 */
export function StoreLocation() {
  const locationPermission = useLocationPermission();

  // Get location
  useEffect(() => {
    if (!locationPermission) return;
    const interval = setInterval(() => {
      storeLocation();
    }, 10000);
    return () => clearInterval(interval);
  }, [locationPermission]);

  return null;
}

async function storeLocation() {
  const locationResponse = await getCurrentPositionAsync({ accuracy: Accuracy.Highest });
  console.log(locationResponse);
  appendLogFile(locationResponse.coords, locationResponse.timestamp);
}
