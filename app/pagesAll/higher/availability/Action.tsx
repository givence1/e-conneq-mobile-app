import { getWeekRange } from "@/utils/functions";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Slot {
  start: string;
  end: string;
}

interface ActionProps {
  formData: any;
  setShowSettings: (value: boolean) => void;
  dataToSubmitOld: Record<string, Slot[]>;
  dataToSubmit: Record<string, Slot[]>;
  setDataToSubmit: React.Dispatch<React.SetStateAction<any>>;
}

const Action: React.FC<ActionProps> = ({
  formData,
  dataToSubmitOld,
  setDataToSubmit,
  setShowSettings,
}) => {
  const [selected, setSelected] = useState<Record<string, Slot[]>>({});

  const listWeekDays = useMemo(() => {
    return getWeekRange(formData.weekNo, new Date().getFullYear());
  }, [formData.weekNo]);

  const timeSlots = generateTimeSlots(8, 21, parseInt(formData.interval), [
    { start: 12, end: 13 },
  ]);

  useEffect(() => {
    if (dataToSubmitOld) {
      setSelected((prev) => {
        const updated: Record<string, Slot[]> = {};
        listWeekDays.forEach((day) => {
          updated[day] = prev[day] || dataToSubmitOld?.[day] || [];
        });
        return updated;
      });
    }
  }, [listWeekDays, dataToSubmitOld]);

  useEffect(() => {
    setDataToSubmit(selected);
  }, [selected, setDataToSubmit]);

  const toggleSlot = (day: string, slot: Slot) => {
    setShowSettings(false);
    setSelected((prev) => {
      const daySlots = prev[day] || [];
      const exists = daySlots.some(
        (s) => s.start === slot.start && s.end === slot.end
      );
      const updatedSlots = exists
        ? daySlots.filter((s) => s.start !== slot.start || s.end !== slot.end)
        : [...daySlots, slot];
      return { ...prev, [day]: updatedSlots };
    });
  };

  return (
    <FlatList
      data={listWeekDays}
      keyExtractor={(day) => day}
      contentContainerStyle={styles.container}
      renderItem={({ item: day, index }) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayLabel}>{formatDayLabel(day, index)}</Text>

          <View style={styles.slotsContainer}>
            {timeSlots.map((slot) => {
              const isSelected = selected[day]?.some(
                (s) => s.start === slot.start && s.end === slot.end
              );

              return (
                <TouchableOpacity
                  key={`${day}-${slot.start}`}
                  onPress={() => toggleSlot(day, slot)}
                  style={[
                    styles.slotButton,
                    isSelected ? styles.selectedSlot : styles.unselectedSlot,
                  ]}
                >
                  <Text
                    style={
                      isSelected ? styles.selectedText : styles.unselectedText
                    }
                  >
                    {slot.start} - {slot.end}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    />
  );
};

export default Action;

/* ---------------- Helper Functions ---------------- */

function generateTimeSlots(
  startHour: number,
  endHour: number,
  step: number,
  skipRanges: { start: number; end: number }[] = []
): Slot[] {
  const slots: Slot[] = [];
  let hour = startHour;

  while (hour + step <= endHour) {
    const slotStart = hour;
    const slotEnd = hour + step;

    const isInBreak = skipRanges.some(
      (r) => slotStart < r.end && slotEnd > r.start
    );
    if (isInBreak) {
      const currentBreak = skipRanges.find(
        (r) => slotStart < r.end && slotEnd > r.start
      );
      if (currentBreak) {
        hour = currentBreak.end;
        continue;
      }
    }

    slots.push({
      start: `${String(slotStart).padStart(2, "0")}:00`,
      end: `${String(slotEnd).padStart(2, "0")}:00`,
    });

    hour += step;
  }

  return slots;
}

function formatDayLabel(dateStr: string, index: number): string {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? dayNames[index]
    : `${dayNames[index]} (${dateStr})`;
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slotButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 3,
    borderWidth: 1,
  },
  selectedSlot: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  unselectedSlot: {
    backgroundColor: "#ECEFF1",
    borderColor: "#B0BEC5",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "700",
  },
  unselectedText: {
    color: "#333",
    fontWeight: "600",
  },
});
