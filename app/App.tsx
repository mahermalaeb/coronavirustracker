import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StoreLocation } from "./components/location-log";

export default function App() {
  return (
    <View style={styles.container}>
      <StoreLocation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
