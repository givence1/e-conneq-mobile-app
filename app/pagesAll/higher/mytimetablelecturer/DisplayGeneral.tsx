import { formatDateWithSuffix } from "@/utils/functions";
import { EdgeTimeTable } from "@/utils/schemas/interfaceGraphql";
import React, { useEffect, useRef } from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";

const DisplayGeneral = ({ data }: { data: EdgeTimeTable[] }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const slots = data.flatMap((tt) =>
    tt.node.period.flatMap((period) =>
      period.slots.map((slot) => ({
        ...slot,
        date: period.date,
        specialtyName: tt.node?.specialty?.mainSpecialty?.specialtyName,
        level: tt.node?.specialty?.level?.level,
        assignedToName: slot.assignedToName ?? "N/A",
      }))
    )
  );

  const slotsByDate: Record<string, typeof slots> = {};
  slots.forEach((slot) => {
    if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
    slotsByDate[slot.date].push(slot);
  });

  const sortedDates = Object.keys(slotsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const statusColors: Record<string, string> = {
    Pending: "#FFA500",
    Confirmed: "#00B36B",
  };

  return (
    <FlatList
      data={sortedDates}
      keyExtractor={(date) => date}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item: date }) => (
        <View style={{ marginBottom: 12 }}>
          <Animated.View style={[styles.dateContainer, { opacity: fadeAnim }]}>
            <Text style={styles.dateHeader}>{formatDateWithSuffix(date)}</Text>
          </Animated.View>

          {slotsByDate[date]
            .sort((a, b) => a.start.localeCompare(b.start))
            .map((slot, idx) => (
              <View key={`${date}-${slot.start}-${idx}`} style={styles.card}>
                <Text style={styles.course}>{slot.courseName}</Text>
                <Text style={styles.assigned}>
                  {slot.assignedToName} | {slot.specialtyName} - {slot.level}
                </Text>

                <View style={styles.row}>
                  <Text
                    style={{ ...styles.time, color: statusColors[slot.status] }}
                  >
                    {slot.start} - {slot.end}
                  </Text>
                  <Text
                    style={{ ...styles.hall, color: statusColors[slot.status] }}
                  >
                    {slot.hallName}
                  </Text>
                </View>
              </View>
            ))}

          <View style={styles.separator} />
        </View>
      )}
    />
  );
};

export default DisplayGeneral;

const styles = StyleSheet.create({
  dateContainer: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF5722",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  course: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0066cc",
  },
  assigned: {
    fontSize: 12,
    color: "#555",
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
    fontWeight: "600",
  },
  hall: {
    fontSize: 12,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 16,
    marginBottom: 6,
    marginHorizontal: 12,
  },
});
