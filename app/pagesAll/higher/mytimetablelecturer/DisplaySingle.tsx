import { formatDateWithSuffix } from "@/utils/functions";
import { Slot } from "@/utils/schemas/interfaceGraphql";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export interface ExtendedSlot extends Slot {
  year: number;
  monthName: string;
  date: string;
}

const DisplaySingle = ({ data }: { data: ExtendedSlot[] }) => {
  return (
    <FlatList
      data={data?.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.header}>
            <Ionicons name="book" size={20} color="#0066cc" />
            <Text style={styles.courseName}>{item.courseName}</Text>
          </View>

          {/* Date Section */}
          <View style={styles.row}>
            <MaterialIcons name="calendar-today" size={18} color="#555" />
            <Text style={styles.rowText}>{formatDateWithSuffix(item.date)}</Text>
          </View>

          {/* Time Section */}
          <View style={styles.row}>
            <Ionicons name="time-outline" size={18} color="#555" />
            <Text style={styles.rowText}>
              {item.start} - {item.end}
            </Text>
          </View>

          {/* Hall & Status Section */}
          <View style={styles.hallStatusRow}>
            <View style={styles.row}>
              <FontAwesome5 name="door-open" size={18} color="#555" />
              <Text style={styles.rowText}>{item.hallName}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === "Pending"
                  ? styles.statusPending
                  : styles.statusConfirmed,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default DisplaySingle;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rowText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  statusPending: {
    backgroundColor: "#fff4e6",
    borderWidth: 1,
    borderColor: "#ffa500",
  },
  statusConfirmed: {
    backgroundColor: "#e6f9ef",
    borderWidth: 1,
    borderColor: "#00b36b",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  hallStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
