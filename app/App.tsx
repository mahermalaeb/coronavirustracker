import React, { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StoreLocation } from "./components/location-log";
import { ViewLocationHistory } from "./components/location-log/ViewLocationHistory";
import {
  Appbar,
  Surface,
  Provider as PaperProvider,
  Card,
  FAB
} from "react-native-paper";
import { InfectionStatus } from "./components/infection-status/InfectionStatus";

export default function App() {
  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content
          title="Coronavirus Tracker"
          subtitle="Powered by you."
        />
      </Appbar.Header>
      <View style={{ flex: 1, padding: 15 }}>
        <View style={{ flex: 2, marginBottom: 15 }}>
          <InfectionStatus />
        </View>
        <Card style={{ flex: 2 }}>
          <ViewLocationHistory />
        </Card>

        <View style={{ flex: 1 }}>
          <FAB
            label="Check Symptoms"
            style={{ backgroundColor: "#e91e63", marginTop: 30 }}
            // onPress={() => navigation.navigate("Check Symptoms")}
          />
        </View>
      </View>

      <StoreLocation />
    </PaperProvider>
  );
}
