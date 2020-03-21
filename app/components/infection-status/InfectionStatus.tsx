import React, { useState, useEffect, Fragment } from "react";
import { View } from "react-native";
import { Card, Title, Paragraph, List } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export function InfectionStatus() {
  return (
    <Card style={{ backgroundColor: "#dcedc8", marginBottom: 15, flex: 1 }}>
      <Card.Content>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3 }}>
            <Title>No coronavirus contact detected</Title>
            <Paragraph>
              You haven't come into contact with anyone who has reported
              symptoms.
            </Paragraph>
            <Paragraph>
              Please click "check symptoms" if you feel unwell.
            </Paragraph>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Ionicons name="md-checkmark-circle" size={56} color="green" />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
