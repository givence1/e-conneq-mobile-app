import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import COLORS from "../../../../constants/colors";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams(); // course ID from route
  const dummyData = {
    title: "Introduction to Programming",
    notes: ["Week 1 - Basics.pdf", "Week 2 - Variables.pdf"],
    videos: ["Intro Lecture", "Conditionals & Loops"],
    quizzes: ["Quiz 1: Basics", "Quiz 2: Control Flow"],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{dummyData.title}</Text>

      {/* Notes Section */}
      <Text style={styles.sectionTitle}>📄 Notes</Text>
      {dummyData.notes.map((note, idx) => (
        <TouchableOpacity key={idx} style={styles.item}>
          <Text style={styles.itemText}>{note}</Text>
        </TouchableOpacity>
      ))}

      {/* Videos Section */}
      <Text style={styles.sectionTitle}>🎥 Videos</Text>
      {dummyData.videos.map((video, idx) => (
        <TouchableOpacity key={idx} style={styles.item}>
          <Text style={styles.itemText}>{video}</Text>
        </TouchableOpacity>
      ))}

      {/* Quizzes Section */}
      <Text style={styles.sectionTitle}>📝 Quizzes</Text>
      {dummyData.quizzes.map((quiz, idx) => (
        <TouchableOpacity key={idx} style={[styles.item, styles.quizBtn]}>
          <Text style={[styles.itemText, { color: COLORS.white }]}>Start {quiz}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  item: {
    backgroundColor: COLORS.cardBackground,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  quizBtn: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});