import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { EdgeCourse } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CoursesScreen() {
  const { t } = useTranslation();
  const { classId } = useAuthStore();

  const { data, loading, error } = useQuery(GET_COURSES, {
    variables: { specialtyId: Number(classId) },
    skip: !classId,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !classId) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>{t("courses.loadError")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t("courses.myCourses")}</Text>

        <View
          key={data?.allCourses?.edges[0]?.node?.specialty?.academicYear}
          style={styles.yearGroup}
        >
          <Text style={styles.yearTitle}>
            {t("courses.academicYear", {
              year: data?.allCourses?.edges[0]?.node?.specialty?.academicYear,
            })}
          </Text>

          {/* Semester I */}
          <View style={styles.semesterGroup}>
            <Text style={styles.semesterTitle}>{t("courses.semesterI")}</Text>
            {renderTable(
              data?.allCourses?.edges.filter(
                (c: EdgeCourse) => c.node.semester === "I"
              ),
              "I",
              t
            )}
          </View>

          {/* Semester II */}
          <View style={styles.semesterGroup}>
            <Text style={styles.semesterTitle}>{t("courses.semesterII")}</Text>
            {renderTable(
              data?.allCourses?.edges.filter(
                (c: EdgeCourse) => c.node.semester === "II"
              ),
              "II",
              t
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function renderTable(courses: EdgeCourse[], semester: string, t: any) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
          {t("courses.table.number")}
        </Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 6 }]}>
          {t("courses.table.name")}
        </Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
          {t("courses.table.sem")}
        </Text>
      </View>

      {courses?.map((course, index) => (
        <View
          key={course.node.id}
          style={[
            styles.row,
            index % 2 === 0 ? styles.rowEven : styles.rowOdd,
          ]}
        >
          <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
          <Text style={[styles.cell, { flex: 6 }]}>
            {course.node.mainCourse?.courseName}
          </Text>
          <Text style={[styles.cell, { flex: 1 }]}>
            {course?.node?.semester}
          </Text>
        </View>
      ))}
    </View>
  );
}

const GET_COURSES = gql`
  query GetStudentCourses($specialtyId: Decimal!) {
    allCourses(specialtyId: $specialtyId) {
      edges {
        node {
          id
          courseCode
          semester
          specialty {
            id
            academicYear
          }
          mainCourse {
            courseName
          }
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: 16,
  },
  yearGroup: {
    marginBottom: 24,
  },
  yearTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  semesterGroup: {
    marginBottom: 16,
  },
  semesterTitle: {
    fontSize: 16,
    textAlign: "center",
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
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: 8,
  },
});