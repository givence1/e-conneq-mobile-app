import { capitalizeEachWord, formatDateWithSuffix } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface AvailabilitySlot {
  start: string;
  end: string;
  year: number;
  date: string;
  monthName: string;
}

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
};

const ViewAvailability = ({
  data,
  setSelected,
  selected,
}: {
  data: AvailabilitySlot[];
  setSelected: any;
  selected: any;
}) => {
  const { t } = useTranslation();

  if (!data?.length) {
    return (
      <View style={styles.emptyContainer}>
        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() =>
            setSelected({ weekRange: selected?.weekRange, display: "create" })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Empty Message */}
        <View style={styles.emptyContent}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            {capitalizeEachWord(t("no data available for the selected week"))}
          </Text>
          <Text style={styles.emptySubText}>{t("ui.add")}
            {/* Tap the + button to add a new slot */}
          </Text>
        </View>
      </View>
    );
  }

  const slotsByDate: Record<string, AvailabilitySlot[]> = {};
  data.forEach((slot) => {
    if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
    slotsByDate[slot.date].push(slot);
  });

  const sortedDates = Object.keys(slotsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <FlatList
      data={sortedDates}
      keyExtractor={(date) => date}
      ListHeaderComponent={
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setSelected({ weekRange: null, display: null })}
          >
            <Text>{capitalizeEachWord(t("back"))}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              setSelected({
                weekRange: selected?.weekRange,
                display: "edit",
              })
            }
          >
            <Text>{capitalizeEachWord(t("editing"))}</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item: date }) => {
        const slots = slotsByDate[date].sort((a, b) =>
          a.start.localeCompare(b.start)
        );
        const chunkedSlots = chunkArray(slots, 3);

        return (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.dateHeader}>{formatDateWithSuffix(date)}</Text>

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

            <View style={styles.separator} />
          </View>
        );
      }}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
};

export default ViewAvailability;

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#abddfd",
    borderRadius: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  emptyContent: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
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
