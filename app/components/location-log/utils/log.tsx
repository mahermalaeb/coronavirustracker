import React, { useEffect } from "react";
import * as FileSystem from "expo-file-system";
import moment from "moment";

export interface ILocation {
  accuracy?: number;
  altitude: number;
  altitudeAccuracy?: number;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

export async function appendLogFile(location: ILocation, timestamp: number) {
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

export async function getLogFile(fileName: string) {
  var data = {};
  try {
    var jsonFile = await FileSystem.readAsStringAsync(fileName);
    data = JSON.parse(jsonFile);
  } catch (e) {}

  return data;
}

export async function createLogDirectoryIfNotExists() {
  try {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "location-log"
    );
  } catch (e) {}
}

export function todaysLogFileName(timestamp?: number) {
  const day = moment.utc(timestamp).format("DD_MM_YYYY");
  return FileSystem.documentDirectory + `${day}.json`;
}

export function getLocationHistoryLine(locationHistory: Array<ILocation>) {
  return Object.values(locationHistory).map(location => ({
    latitude: location.latitude,
    longitude: location.longitude
  }));
}

export function getLocationHistoryRegion(locationHistory: Array<ILocation>) {
  const locations = Object.values(locationHistory);

  // Initialise min/max
  let region = {
    latitudeMin: locations[0].latitude,
    latitudeMax: locations[0].latitude,
    longitudeMin: locations[0].longitude,
    longitudeMax: locations[0].longitude
  };

  // Go through all locations
  for (let location of locations) {
    region.latitudeMin = Math.min(region.latitudeMin, location.latitude);
    region.latitudeMax = Math.max(region.latitudeMax, location.latitude);
    region.longitudeMin = Math.min(region.longitudeMin, location.longitude);
    region.longitudeMax = Math.max(region.longitudeMax, location.longitude);
  }

  return {
    latitude: region.latitudeMin,
    longitude: region.longitudeMin,
    latitudeDelta: region.latitudeMax - region.latitudeMin,
    longitudeDelta: region.longitudeMax - region.longitudeMin
  };
}
