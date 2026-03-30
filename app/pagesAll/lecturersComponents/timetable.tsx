import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { JSX } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import COLORS from "../../../constants/colors";

// Define types for the timetable data
type Session = {
  course: string;
  time: string;
  room: string;
};

type TimetableData = {
  [day: string]: Session[];
};

const timetableData: TimetableData = {
  Monday: [
    { course: "Web Development", time: "9:00 AM - 11:00 AM", room: "Lab 2" },
    { course: "Database Systems", time: "2:00 PM - 4:00 PM", room: "Room 101" },
  ],
  Wednesday: [
    { course: "Data Structures", time: "11:00 AM - 1:00 PM", room: "Lab 1" },
  ],
  Friday: [
    { course: "Computer Networks", time: "10:00 AM - 12:00 PM", room: "Room 202" },
  ],
};

export default function LecturerTimetableScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      {/* ✅ Fixed Tabs Header */}
      <AppHeader showBack  showTitle  />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📅 Weekly Timetable</Text>

        {Object.entries(timetableData).map(([day, sessions]) => (
          <View key={day} style={styles.daySection}>
            <Text style={styles.dayTitle}>{day}</Text>
            {sessions.map((session, idx) => (
              <View key={idx} style={styles.card}>
                <Ionicons
                  name="book-outline"
                  size={22}
                  color={COLORS.primary}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.course}>{session.course}</Text>
                  <Text style={styles.meta}>
                    {session.time} • {session.room}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Define typed styles
const styles = StyleSheet.create<{
  container: ViewStyle;
  scrollContent: ViewStyle;
  title: TextStyle;
  daySection: ViewStyle;
  dayTitle: TextStyle;
  card: ViewStyle;
  cardContent: ViewStyle;
  course: TextStyle;
  meta: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  daySection: {
    marginBottom: 25,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardContent: {
    marginLeft: 10,
  },
  course: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  meta: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
