import { formatDateWithSuffix } from "@/utils/functions";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export interface AvailabilitySlot {
  start: string;
  end: string;
  year: number;
  date: string;
  monthName: string;
}

// Utility: chunk an array into groups of N
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// Normalize date safely to prevent invalid Date crashes
const normalizeDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  // Try handling formats like DD/MM/YYYY or DD-MM-YYYY
  const parts = dateStr.split(/[/-]/);
  if (parts.length === 3) {
    const [d, m, y] = parts.map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  return null;
};

const DisplaySingle = ({ data }: { data: AvailabilitySlot[] }) => {
  if (!data?.length) return null;

  // Group slots by date
  const slotsByDate: Record<string, AvailabilitySlot[]> = {};
  data.forEach((slot) => {
    if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
    slotsByDate[slot.date].push(slot);
  });

  // Sort dates safely
  const sortedDates = Object.keys(slotsByDate).sort((a, b) => {
    const da = normalizeDate(a);
    const db = normalizeDate(b);
    if (!da || !db) return 0;
    return da.getTime() - db.getTime();
  });

  return (
    <FlatList
      data={sortedDates}
      keyExtractor={(date) => date}
      scrollEnabled={false} // prevents nested scroll conflict
      renderItem={({ item: date }) => {
        const slots = slotsByDate[date].sort((a, b) =>
          a.start.localeCompare(b.start)
        );
        const chunkedSlots = chunkArray(slots, 3); // max 3 per row

        // Safely formatted date
        const safeDate = normalizeDate(date);
        const formattedDate = safeDate
          ? formatDateWithSuffix(safeDate.toISOString())
          : date;

        return (
          <View style={{ marginBottom: 12 }}>
            {/* Date Header */}
            <Text style={styles.dateHeader}>{formattedDate}</Text>

            {/* Slots Rows */}
            {chunkedSlots.map((row, rowIndex) => (
              <View key={`${date}-row-${rowIndex}`} style={styles.rowContainer}>
                {row.map((slot, idx) => (
                  <View
                    key={`${date}-${slot.start}-${idx}`}
                    style={styles.card}
                  >
                    <Text style={styles.timeText}>
                      {slot.start} - {slot.end}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Separator */}
            <View style={styles.separator} />
          </View>
        );
      }}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};

export default DisplaySingle;

const styles = StyleSheet.create({
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF5722",
    textAlign: "center",
    marginVertical: 8,
    backgroundColor: "#fff7f0",
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 12,
    margin: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 6,
    marginHorizontal: 12,
  },
});
