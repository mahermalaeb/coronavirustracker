import React, { useState, useEffect, Fragment } from "react";
import { Provider as PaperProvider, FAB } from "react-native-paper";
import { Appbar, Title, Paragraph, Surface } from "react-native-paper";
import { Tracker } from "./components/SaveLocation";
import { Status } from "./components/Status";

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

export function App() {
  return (
    <Fragment>
      <Appbar.Header>
        <Appbar.Content
          title="Coronavirus Tracker"
          subtitle="Powered by you."
        />
      </Appbar.Header>
      <Surface
        style={{ padding: 15, height: "100%", backgroundColor: "#efefef" }}
      >
        <Status />
        <Tracker />
        <FAB
          label="Check Symptoms"
          style={{ backgroundColor: "#e91e63", marginTop: 30 }}
          onPress={() => console.log("Pressed")}
        />
      </Surface>
    </Fragment>
  );
}
