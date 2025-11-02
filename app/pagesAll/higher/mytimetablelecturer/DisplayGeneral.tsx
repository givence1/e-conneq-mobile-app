import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Animated } from "react-native";
import { EdgeTimeTable } from "@/utils/schemas/interfaceGraphql";
import { formatDateWithSuffix } from "@/utils/functions";

const DisplayGeneral = ({ data }: { data: EdgeTimeTable[] }) => {

    const fadeAnim = useRef(new Animated.Value(0)).current; // initial opacity 0
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

  // Group slots by date
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
      renderItem={({ item: date }) => (
        <View style={{ marginBottom: 12 }}>

          {/* Date Header */}
           <Animated.View style={[styles.dateContainer, { opacity: fadeAnim }]}>
      <Text style={styles.dateHeader}>{formatDateWithSuffix(date)}</Text>
    </Animated.View>

          {/* Slots for the day */}
          {slotsByDate[date]
            .sort((a, b) => a.start.localeCompare(b.start))
            .map((slot, idx) => (
              <View
                key={`${date}-${slot.start}-${idx}`} // use idx as last fallback
                style={styles.card}
              >
                {/* Course */}
                <Text style={styles.course}>{slot.courseName}</Text>

                {/* Teacher & Specialty */}
                <Text style={styles.assigned}>
                  {slot.assignedToName} | {slot.specialtyName} - {slot.level}
                </Text>

                {/* Time & Hall */}
                <View style={styles.row}>
                  <Text style={{ ...styles.time, color: statusColors[slot.status] }}>
                    {slot.start} - {slot.end}
                  </Text>
                  <Text style={{ ...styles.hall, color: statusColors[slot.status] }}>
                    {slot.hallName}
                  </Text>
                </View>
              </View>
            ))}


          {/* Separator */}
          <View style={styles.separator} />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 40 }}
    />

  );
};

export default DisplayGeneral;

const styles = StyleSheet.create({
  dateContainer: {
    backgroundColor: "#FFF3E0", // light background (peach)
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
    color: "#FF5722", // bold distinct color
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
