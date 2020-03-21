import React, { useEffect } from "react";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import moment from "moment";
import { useLocationPermission } from "./useLocationPermission";

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
  const locationResponse = await Location.getCurrentPositionAsync({});
  appendLogFile(locationResponse.coords, locationResponse.timestamp);
}

interface ILocation {
  accuracy?: number;
  altitude: number;
  altitudeAccuracy?: number;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

async function appendLogFile(location: ILocation, timestamp: number) {
  // Read today's log file
  var fileName = todaysLogFileName(timestamp);
  var data = await getLogFile(fileName);

  // Append with current data
  const timeRounded10Seconds =
    Math.round((timestamp + Number.EPSILON) / 10) * 10;
  const entry = {
    [timeRounded10Seconds]: location
  };
  const appendedData = { ...data, ...entry };
  const appendedDataString = JSON.stringify(appendedData);

  // Write to the log file
  await createLogDirectoryIfNotExists();
  try {
    await FileSystem.writeAsStringAsync(fileName, appendedDataString);
  } catch (e) {
    console.log(e);
  }
}

async function getLogFile(fileName: string) {
  var data = {};
  try {
    var jsonFile = await FileSystem.readAsStringAsync(fileName);
    data = JSON.parse(jsonFile);
  } catch (e) {}

  return data;
}

async function createLogDirectoryIfNotExists() {
  try {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "location-log"
    );
  } catch (e) {}
}

function todaysLogFileName(timestamp: number) {
  const day = moment.utc(timestamp).format("DD_MM_YYYY");
  return FileSystem.documentDirectory + `${day}.json`;
}
