import { useRouter } from "expo-router";
import React from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import TabsHeader from "../../components/AppHeader";
import COLORS from "../../constants/colors";

const resultsData = [
  {
    year: "2023 - 2024",
    data: [
      {
        id: "ca_sem1",
        title: "Semester 1 - CA",
        paid: true,
        type: "CA",
        semester: "1",
        year: "2023-2024",
      },
      {
        id: "exam_sem1",
        title: "Semester 1 - Exams",
        paid: false,
        type: "Exam",
        semester: "1",
        year: "2023-2024",
      },
      {
        id: "ca_sem2",
        title: "Semester 2 - CA",
        paid: true,
        type: "CA",
        semester: "2",
        year: "2023-2024",
      },
      {
        id: "exam_sem2",
        title: "Semester 2 - Exams",
        paid: false,
        type: "Exam",
        semester: "2",
        year: "2023-2024",
      },
    ],
  },
];

export default function ResultsScreen() {
  const router = useRouter();

  const handleView = (item) => {
    if (item.paid) {
      router.push({
        pathname: "/student/results/details",
        params: {
          id: item.id,
          type: item.type,
          semester: item.semester,
          year: item.year,
        },
      });
    } else {
      alert("Please pay 1000 XAF to unlock this result.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TabsHeader />
      <SectionList
        sections={resultsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderSectionHeader={({ section: { year } }) => (
          <Text style={styles.sectionHeader}>{year}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleView(item)}
          >
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text
              style={{
                color: item.paid ? COLORS.primary : COLORS.textSecondary,
              }}
            >
              {item.paid ? "Paid ✅" : "Locked 🔒"}
            </Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => <Text style={styles.title}>My Results</Text>}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 80, // space below TabsHeader
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
});
