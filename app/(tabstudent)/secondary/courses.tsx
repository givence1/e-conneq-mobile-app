import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/AppHeader";
import COLORS from "../../../constants/colors";

const coursesByYear = [
  {
    year: "2025/2026 Academic Year",
    semesters: [
      {
        semester: "Term I",
        courses: [
          { id: "1", name: "ADVANCED TECHNIQUES IN OBSTETRICS" },
          { id: "2", name: "BLOOD TRANSFUSION" },
          { id: "3", name: "CHILDCARE NUTRITION AND DIETETICS" },
          { id: "4", name: "CLINICAL PHARMACOLOGY I" },
          { id: "5", name: "COMMUNITY NURSING" },
          { id: "6", name: "DYSTOCIA" },
          { id: "7", name: "INTENSIVE CARE I" },
          { id: "8", name: "MEDICAL PATHOLOGY I" },
          { id: "9", name: "MEDICAL SURGICAL NURSING" },
          { id: "10", name: "NURSING CARE PLANNING" },
        ],
      },
          {
            semester: "Term II",
            courses: [
              { id: "11", name: "PAEDIATRIC NURSING" },
              { id: "13", name: "GERIATRIC NURSING" },
              { id: "14", name: "GERIATRIC NURSING" },
              { id: "15", name: "GERIATRIC NURSING" },
              { id: "16", name: "GERIATRIC NURSING" },
              { id: "17", name: "GERIATRIC NURSING" },
              { id: "18", name: "GERIATRIC NURSING" },
              { id: "19", name: "GERIATRIC NURSING" },
            ],
          },
          {
            semester: "Term III",
            courses: [
              { id: "11", name: "PAEDIATRIC NURSING" },
              { id: "13", name: "GERIATRIC NURSING" },
              { id: "14", name: "GERIATRIC NURSING" },
              { id: "15", name: "GERIATRIC NURSING" },
              { id: "16", name: "GERIATRIC NURSING" },
              { id: "17", name: "GERIATRIC NURSING" },
              { id: "18", name: "GERIATRIC NURSING" },
              { id: "19", name: "GERIATRIC NURSING" },
            ],
          },
          {
            semester: "Term IV",
            courses: [
              { id: "11", name: "PAEDIATRIC NURSING" },
              { id: "13", name: "GERIATRIC NURSING" },
              { id: "14", name: "GERIATRIC NURSING" },
              { id: "15", name: "GERIATRIC NURSING" },
              { id: "16", name: "GERIATRIC NURSING" },
              { id: "17", name: "GERIATRIC NURSING" },
              { id: "18", name: "GERIATRIC NURSING" },
              { id: "19", name: "GERIATRIC NURSING" },
            ],
          },
    ],
  },
];

export default function CoursesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TabsHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Subjects</Text>

        {coursesByYear.map((yearGroup) => (
          <View key={yearGroup.year} style={styles.yearGroup}>
            <Text style={styles.yearTitle}>{yearGroup.year}</Text>

            {yearGroup.semesters.map((sem, indexSem) => (
              <View key={sem.semester} style={styles.semesterGroup}>
                <Text style={styles.semesterTitle}>{sem.semester}</Text>

                <View style={styles.table}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
                      #
                    </Text>
                    <Text style={[styles.cell, styles.headerCell, { flex: 6 }]}>
                      Subject Name
                    </Text>
                    <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>
                      Term
                    </Text>
                  </View>

                  {sem.courses.map((course, index) => (
                    <View
                      key={course.id}
                      style={[
                        styles.row,
                        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                      ]}
                    >
                      <Text style={[styles.cell, { flex: 1 }]}>
                        {index + 1}
                      </Text>
                      <Text style={[styles.cell, { flex: 6 }]}>
                        {course.name}
                      </Text>
                      <Text style={[styles.cell, { flex: 1 }]}>{indexSem === 0 ? "I" : "II"}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 80, // ensure content starts below TabsHeader
    paddingHorizontal: 16,
    paddingBottom: 40, // to allow full scroll to bottom
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  yearGroup: {
    marginBottom: 24,
  },
  yearTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  semesterGroup: {
    marginBottom: 12,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  rowEven: {
    backgroundColor: COLORS.background,
  },
  rowOdd: {
    backgroundColor: COLORS.cardBackground,
  },
  cell: {
    paddingHorizontal: 6,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  headerCell: {
    fontWeight: "700",
    fontSize: 18,
    color: COLORS.textDark,
    paddingVertical: 8
  },
});
