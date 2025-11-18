import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { getAcademicYear } from "@/utils/functions";
import { EdgeCourse } from "@/utils/schemas/interfaceGraphql";
import { gql } from "@apollo/client";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";


const ListCourses = (
    { loading, error, courses, apiYears }:
        { loading: boolean, error: any, courses: EdgeCourse[], apiYears?: string[] }
) => {
    const { t } = useTranslation();
    const { role } = useAuthStore();
    const [selectedYear, setSelectedYear] = useState(getAcademicYear());

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
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
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: 86 },
                    { paddingBottom: 2 },
                ]}
                showsVerticalScrollIndicator={false}
            >

              {role !== "student" && (
  <View style={styles.selectWrapper}>
    <SelectPicker
      selectedValue={selectedYear}
      onValueChange={(v) => setSelectedYear(v)}
      style={styles.selectPicker}
      dropdownIconColor={COLORS.textSecondary}
    >
      <SelectPicker.Item label="-----------" value="" />
      {apiYears?.map((y: string) => (
        <SelectPicker.Item key={y} label={y} value={y} />
      ))}
    </SelectPicker>
  </View>
)}



                <Text style={styles.title}>{t("courses.myCourses")}</Text>

                {!courses || courses?.length < 1 ?
                    <View style={styles.loadingContainer}>
                        <Text style={{ color: "red" }}>{t("courses.loadError")}</Text>
                    </View> : null}

                {courses && courses.length > 0 ? <View
                    key={courses[0]?.node?.specialty?.academicYear}
                    style={styles.yearGroup}
                >
                    

                    {/* Semester I */}
                    <View style={styles.semesterGroup}>
                        <Text style={styles.semesterTitle}>{t("courses.semesterI")}</Text>
                        {renderTable(
                            courses?.filter(
                                (c: EdgeCourse) => c.node.semester === "I" && c.node.specialty.academicYear === selectedYear
                            ),
                            "I",
                            t
                        )}
                    </View>

                    {/* Semester II */}
                    <View style={styles.semesterGroup}>
                        <Text style={styles.semesterTitle}>{t("courses.semesterII")}</Text>
                        {renderTable(
                            courses?.filter(
                                (c: EdgeCourse) => c.node.semester === "II" && c.node.specialty.academicYear === selectedYear
                            ),
                            "II",
                            t
                        )}
                    </View>
                </View> : null}

            </ScrollView>
        </View>
    );
}

export default ListCourses


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
                    key={course.node.id} // ✅ unique key now
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
        paddingTop: 80,
        paddingHorizontal: 16,
        paddingBottom: 40,
        marginTop: -20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "700",
        color: COLORS.primary,
        marginBottom: 16,
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
     selectWrapper: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.cardBackground,
  },
  selectPicker: {
    paddingVertical: 1,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
});
