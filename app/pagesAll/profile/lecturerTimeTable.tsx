import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Mock timetable data (you’ll replace this with GraphQL/API)
const mockTimetable = [
  {
    day: "Monday",
    courses: [
      { subject: "French", time: "8:00 - 10:00", venue: "Room 201", dept: "Telecommunication" },
      { subject: "Analog Electronics I", time: "10:00 - 12:00", venue: "Lab 1", dept: "Accountancy" },
      { subject: "Analog Electronics I", time: "12:00 - 2:00", venue: "E201", dept: "Marketing" },
    ],
  },
  {
    day: "Tuesday",
    courses: [
      { subject: "English", time: "8:00 - 10:00", venue: "Room 102", dept: "Marketing" },
      { subject: "Business Mathematics I", time: "10:00 - 12:00", venue: "Room 103", dept: "Telecommunication" },
    ],
  },
  {
    day: "wednesday",
    courses: [
      { subject: "English", time: "8:00 - 10:00", venue: "Room 102", dept: "Marketing" },
      { subject: "Business Mathematics I", time: "10:00 - 12:00", venue: "Room 103", dept: "Telecommunication" },
    ],
  },
  {
    day: "Thursday",
    courses: [
      { subject: "English", time: "8:00 - 10:00", venue: "Room 102", dept: "Marketing" },
      { subject: "Business Mathematics I", time: "10:00 - 12:00", venue: "Room 103", dept: "Telecommunication" },
    ],
  },
  {
    day: "Friday",
    courses: [
      { subject: "English", time: "8:00 - 10:00", venue: "Room 102", dept: "Marketing" },
      { subject: "Business Mathematics I", time: "10:00 - 12:00", venue: "Room 103", dept: "Telecommunication" },
    ],
  },
];

export default function TimetableScreen() {
  const [viewType, setViewType] = useState<"grid" | "card">("card");

  return (
    <View style={styles.wrapper}>
      <AppHeader showBack showTitle />

      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewType === "grid" && styles.toggleButtonActive,
          ]}
          onPress={() => setViewType("grid")}
        >
          <Ionicons name="grid-outline" size={18} color={COLORS.primary} />
          <Text style={styles.toggleText}>Grid</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewType === "card" && styles.toggleButtonActive,
          ]}
          onPress={() => setViewType("card")}
        >
          <Ionicons name="list-outline" size={18} color={COLORS.primary} />
          <Text style={styles.toggleText}>Card</Text>
        </TouchableOpacity>
      </View>

      {viewType === "grid" ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell]}>Day</Text>
              <Text style={[styles.cell, styles.headerCell]}>Telecom</Text>
              <Text style={[styles.cell, styles.headerCell]}>Accountancy</Text>
              <Text style={[styles.cell, styles.headerCell]}>Software</Text>
              <Text style={[styles.cell, styles.headerCell]}>Marketing</Text>
            </View>

            {/* Data Rows */}
            {mockTimetable.map((day) => (
              <View key={day.day} style={styles.row}>
                <Text style={[styles.cell, styles.dayCell]}>{day.day}</Text>
                {["Telecommunication", "Accountancy", "Software", "Marketing"].map((dept) => {
                  const course = day.courses.find((c) => c.dept === dept);
                  return (
                    <View key={dept} style={[styles.cell, styles.courseCell]}>
                      {course ? (
                        <View style={styles.courseBox}>
                          <Text style={styles.courseTitle}>{course.subject}</Text>
                          <Text style={styles.courseTime}>{course.time}</Text>
                          <Text style={styles.courseVenue}>{course.venue}</Text>
                        </View>
                      ) : (
                        <Text style={styles.emptyCell}>—</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        // Secondary Card View
        <ScrollView style={styles.cardContainer}>
          {mockTimetable.map((day) => (
            <View key={day.day} style={styles.cardDayBlock}>
              <Text style={styles.cardDay}>{day.day}</Text>
              {day.courses.map((course, index) => (
                <View key={index} style={styles.courseCard}>
                  <Text style={styles.cardCourseTitle}>{course.subject}</Text>
                  <Text style={styles.cardCourseDetail}>{course.dept}</Text>
                  <Text style={styles.cardCourseDetail}>{course.time}</Text>
                  <Text style={styles.cardCourseDetail}>{course.venue}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 60 : 0,
  },
  toggleWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary + "20",
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 6,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: COLORS.primary,
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 120,
    padding: 8,
    textAlign: "center",
  },
  headerCell: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  dayCell: {
    backgroundColor: "#f3f3f3",
    fontWeight: "600",
  },
  courseCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  courseBox: {
    backgroundColor: "#E0E6F7",
    borderRadius: 6,
    padding: 6,
  },
  courseTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  courseTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  courseVenue: {
    fontSize: 11,
    color: COLORS.primary,
    textAlign: "center",
  },
  emptyCell: {
    color: COLORS.textSecondary,
  },
  cardContainer: {
    paddingHorizontal: 16,
  },
  cardDayBlock: {
    marginBottom: 16,
  },
  cardDay: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCourseTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardCourseDetail: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});
