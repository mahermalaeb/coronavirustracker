import React, { useState, useEffect } from "react";
import * as Permissions from "expo-permissions";

export function useLocationPermission() {
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    async function getLocationPermission() {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        setLocationPermission(true);
      } else {
        setLocationPermission(false);
      }
    }
    getLocationPermission();
  }, []);

  return locationPermission;
}
