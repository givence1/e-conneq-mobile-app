import { formatDateWithSuffix } from "@/utils/functions";
import { Feather } from "@expo/vector-icons"; // ⏰ Added import for the clock icon
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DisplayWeeks = ({
  data,
  setSelected,
}: {
  data: string[][]; // array of weeks, each week is 7 date strings
  setSelected: any;
}) => {
  if (!data?.length) return null;

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => `week-${index}`}
      renderItem={({ item: week }) => {
        const startDate = week[0];
        const endDate = week[week.length - 1];

        return (
          <View style={styles.weekContainer}>
            <TouchableOpacity
              style={styles.weekRow}
              onPress={() =>
                setSelected({
                  weekRange: week,
                  display: "view",
                })
              }
            >
              {/* ⏰ Clock icon added here */}
              <Feather name="clock" size={24} color="#0056b3" style={{ marginBottom: 6 }} />

              <Text style={styles.weekHeader}>{formatDateWithSuffix(startDate)}</Text>
              <Text style={styles.weekHeader}> - </Text>
              <Text style={styles.weekHeader}>{formatDateWithSuffix(endDate)}</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        );
      }}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};

export default DisplayWeeks;

const styles = StyleSheet.create({
  weekContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  weekRow: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,

    // ✅ Left border color like in your image
    borderLeftWidth: 5,
    borderLeftColor: "#0056b3",
  },
  weekHeader: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "80%",
    marginVertical: 6,
  },
});