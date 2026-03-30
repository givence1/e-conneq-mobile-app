import COLORS from "@/constants/colors";
import { capitalizeEachWord, getAcademicYear } from "@/utils/functions";
import { EdgeCourse, NodeCourse } from "@/utils/schemas/interfaceGraphql";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


const DisplayCourseMaterial = (
    { loading, error, courses, setShowDetail, apiYears, source }:
        { loading: boolean, error: any, courses: EdgeCourse[], setShowDetail: any, apiYears: string[], source: "H" | "S" | "P" }
) => {
    const { t } = useTranslation();
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
        <>
            {!courses || courses?.length < 1 ?
                <View style={styles.loadingContainer}>
                    <Text style={{ color: "red" }}>{t("courses.loadError")}</Text>
                </View> : null}

            {courses && courses?.length > 0 ?
                <View
                    key={courses[0]?.node?.specialty?.academicYear}
                    style={styles.yearGroup}
                >

                    {/* Semester I */}
                    <View style={styles.semesterGroup}>
                        <Text style={styles.semesterTitle}>{t("courses.semesterI")}</Text>
                        {renderTable(
                            [...courses]
                                .sort((a: EdgeCourse, b: EdgeCourse) =>
                                    a?.node?.mainCourse?.courseName > b?.node?.mainCourse?.courseName
                                        ? 1
                                        : a?.node?.mainCourse?.courseName < b?.node?.mainCourse?.courseName
                                            ? -1
                                            : 0
                                )
                                .filter(
                                    (c: EdgeCourse) =>
                                        c.node.semester === "I" &&
                                        c.node.specialty.academicYear === selectedYear
                                ),
                            setShowDetail,
                            t
                        )}
                    </View>

                    {/* Semester II */}
                    <View style={styles.semesterGroup}>
                        <Text style={styles.semesterTitle}>{t("courses.semesterII")}</Text>
                        {renderTable(
                            [...courses] // create a shallow copy
                                .sort((a: EdgeCourse, b: EdgeCourse) =>
                                    a?.node?.mainCourse?.courseName > b?.node?.mainCourse?.courseName
                                        ? 1
                                        : a?.node?.mainCourse?.courseName < b?.node?.mainCourse?.courseName
                                            ? -1
                                            : 0
                                )
                                .filter(
                                    (c: EdgeCourse) =>
                                        c.node.semester === "II" &&
                                        c.node.specialty.academicYear === selectedYear
                                ),
                            setShowDetail,
                            t
                        )}
                    </View>

                </View> : null}
        </>
    );
}

export default DisplayCourseMaterial


const renderTable = (courses: EdgeCourse[], setShowDetail: any, t: any) => {
    const [clicked, setClicked] = useState(false)

    const StatusDots = (course: NodeCourse) => {
        const statuses = [
            { value: course?.fileStatusCa, key: "CA" },
            { value: course?.fileStatusExam, key: "Exam" },
            { value: course?.fileStatusOutline, key: "Outline" },
            { value: course?.fileStatusResit, key: "Resit" },
        ];

        return <View style={{ flexDirection: "row" }}>
            {statuses.map((status) => (
                <View
                    key={status.key}
                    style={[
                        styles.dot,
                        { backgroundColor: status.value === "PENDING" ? "#FFA500" : status.value === "APPROVED" ? "#06b16cff" : status?.value === "REJECTED" ? "#fc1307ff" : "#ff3a3013" },
                    ]}
                />
            ))}
        </View>;
    };

    return (
        <View style={styles.table}>
            <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>
                    {capitalizeEachWord(t("courses.table.number"))}
                </Text>
                <Text style={[styles.cell, styles.headerCell, { flex: 9 }]}>
                    {capitalizeEachWord(t("courses.table.name"))}
                </Text>
                <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>
                    {capitalizeEachWord("status")}
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
                    <Text style={[styles.cell, { flex: 9 }]}>
                        {course.node.mainCourse?.courseName?.slice(0, 25)}{"\n"}
                        {course.node?.specialty?.mainSpecialty?.specialtyName?.slice(0, 20)} - {course.node?.specialty?.level?.level}{"\n"}
                    </Text>
                    <View style={[styles.cell, { flex: 2, justifyContent: "center", alignItems: "center" }]}>
                        <TouchableOpacity
                            onPress={() => { setShowDetail({ show: true, selectedItem: course.node }); setClicked(true) }}
                            disabled={clicked}
                        >
                            {clicked ?
                                <ActivityIndicator size="large" color="#fff" />
                                :
                                StatusDots(course?.node)
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
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
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 2,
    },
});