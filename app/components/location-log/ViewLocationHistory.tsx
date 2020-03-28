import React, { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";
import {
  getLogFile,
  todaysLogFileName,
  getLocationHistoryRegion,
  getLocationHistoryLine
} from "./utils/log";

export function ViewLocationHistory() {
  const [locationHistory, setLocationHistory] = useState([]);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0
  });

  useEffect(() => {
    const setLog = async () => {
      const fileName = todaysLogFileName();
      const log = await getLogFile(fileName);
      const line = getLocationHistoryLine(log);
      setLocationHistory(line);

      const initialRegion = getLocationHistoryRegion(log);
      setRegion(initialRegion);
    };
    setLog();
  }, []);

  return (
    <View>
      <MapView
        style={styles.mapStyle}
        showsUserLocation
        region={region}
        onRegionChange={setRegion}
      >
        <Polyline coordinates={locationHistory} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapStyle: {
    width: "100%",
    height: "100%"
  }
});
