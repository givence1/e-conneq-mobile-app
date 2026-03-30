import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { decodeUrlID } from '@/utils/functions';
import { EdgeResult, NodePublish, NodeSchoolFees, NodeUserProfile } from '@/utils/schemas/interfaceGraphql';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const DisplayResults = (
    { result_type, results, semester, title }:
        { result_type: "ca" | "exam" | "resit" | "results", results: EdgeResult[] | undefined, semester: "I" | "II" | null, title: string }
) => {
    const { t } = useTranslation();
    const { campusInfo, profileId } = useAuthStore();
    const [statusPlatform, setStatusPlatform] = useState<boolean>(false)
    const [statusFees, setStatusFees] = useState<boolean>(false)
    const [statusPublish, setStatusPublish] = useState<boolean>(false)

    const { data: dataFees, loading: loadingFees } = useQuery(GET_FEES, {
        variables: { userprofileId: profileId },
    });

    useEffect(() => {
        if (dataFees?.allSchoolFees.edges?.length) {
            const fees: NodeSchoolFees = dataFees?.allSchoolFees.edges[0]?.node;
            const tuition: number = fees?.userprofile?.specialty?.tuition;
            const balance: number = fees?.balance;
            const paid: number = tuition > 0 ? (tuition - balance) / (tuition) : 0;

            let feesControl = fees?.userprofile?.specialty?.school?.schoolfeesControl
                ?.split(', ')
                .map(Number)
                .filter(item => !isNaN(item)) || [];

            let semesterControl: number[] = [];
            if (semester === 'I') {
                semesterControl = feesControl.slice(0, 3);
            } else if (semester === 'II') {
                semesterControl = feesControl.slice(3, 6);
            }

            let checkPercent = 1;
            if (result_type === "ca" && semesterControl.length > 0) {
                checkPercent = semesterControl[0];
            } else if (result_type === "exam" && semesterControl.length > 1) {
                checkPercent = semesterControl[1];
            } else if (result_type === "resit" && semesterControl.length > 2) {
                checkPercent = semesterControl[2];
            } else if (result_type === "results" && semesterControl.length > 2) {
                checkPercent = semesterControl[2];
            }
            setStatusPlatform(fees.platformPaid);
            setStatusFees(paid >= checkPercent);
        }
    }, [dataFees, semester, result_type]);

    const [getPublish, { data: dataPublish, loading: loadingPublish }] = useLazyQuery(GET_PUBLISH);

    useEffect(() => {
        if (!dataPublish && dataFees?.allSchoolFees.edges?.length && semester) {
            const prof: NodeUserProfile = dataFees?.allSchoolFees.edges[0]?.node?.userprofile
            getPublish({
                variables: {
                    specialtyId: parseInt(decodeUrlID(prof?.specialty?.id) || "0"),
                    semester
                },
            });
        }
        if (dataPublish && dataFees?.allSchoolFees.edges?.length && semester) {
            const pub: NodePublish = dataPublish?.allPublishes?.edges[0]?.node
             
            if (result_type === "ca" && pub?.ca) {
                setStatusPublish(true);
            } else if (result_type === "exam" && pub?.exam) {
                setStatusPublish(true);
            } else if (result_type === "resit" && pub?.resit) {
                setStatusPublish(true);
            } else if (result_type === "results" && pub?.resit) {
                setStatusPublish(true);
            }
        }
    }, [dataFees, dataPublish, semester]);
    console.log("statusPublish:", statusPublish);
    console.log("statusFees:", statusFees);
    console.log("statusPlatform:", statusPlatform);


    return (
        <View>
            <Text style={styles.title}>{title} - {semester}</Text>

            <View style={styles.table}>
                <View style={styles.rowHeader}>
                    <Text style={[styles.cell, { flex: 4 }]}>{t("results.course")}</Text>
                    {result_type === "results" ? (
                        <>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{t("results.ca")}</Text>
                            <Text style={[styles.cell, { flex: 2, textAlign: "center" }]}>{t("results.exam")}</Text>
                            <Text style={[styles.cell, { flex: 3, textAlign: "center" }]}>{t("results.resit")}</Text>
                            <Text style={[styles.cell, { flex: 1.5, textAlign: "center" }]}>{t("results.status")}</Text>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{result_type.toUpperCase()}</Text>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{t("results.status")}</Text>
                        </>
                    )}
                </View>

                {
                    loadingFees || loadingPublish ?
<<<<<<< HEAD
                        <ActivityIndicator />
                        :
                        !statusPlatform ?
                            <Text>{t("results.accountNotActive")}</Text>
                            :
                            !statusFees ?
                                <Text>{t("results.schoolFees")}</Text>
                                :
                                !statusPublish ?
                                    <Text>{t("results.resultsNotPublished")}</Text>
                                    :
                                    results?.sort((a: EdgeResult, b: EdgeResult) => a.node.course.mainCourse.courseName > b.node.course.mainCourse.courseName ? 1 : a.node.course.mainCourse.courseName < b.node.course.mainCourse.courseName ? -1 : 0)?.map((item, index) => {
                                        const parsedResults = item.node.infoData
                                        const { ca, exam, resit } = parsedResults;

                                        if (result_type === "results") {
                                            const caPassLimit = (campusInfo?.caLimit || 20) / 2;
                                            const examPassLimit = (campusInfo?.examLimit || 40) / 2;
                                            const resitPassLimit = (campusInfo?.resitLimit || 40) / 2;

                                            const overallPassed = (ca || 0) >= caPassLimit || (exam || 0) >= examPassLimit || (resit || 0) >= resitPassLimit;

                                            return (
                                                <View key={index} style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 4 }]}>{item.node.course.mainCourse.courseName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{ca}</Text>
                                                    <Text style={[styles.cell, { flex: 2, textAlign: "center" }]}>{exam}</Text>
                                                    <Text style={[styles.cell, { flex: 3, textAlign: "center" }]}>{resit || "-"}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {overallPassed ? t("results.pass") : t("results.fail")}
                                                    </Text>
                                                </View>
                                            );
                                        } else {
                                            const mark = result_type === "ca" ? ca :
                                                result_type === "exam" ? exam :
                                                    result_type === "resit" ? resit : 0;

                                            const passLimit = result_type === "ca" ? (campusInfo?.caLimit || 20) / 2 :
                                                result_type === "exam" ? (campusInfo?.examLimit || 40) / 2 :
                                                    result_type === "resit" ? (campusInfo?.resitLimit || 40) / 2 : 0;
console.log(mark);
                                            return (
                                                <View key={index} style={styles.row}>
                                                    {/* <Text style={[styles.cell, { flex: 1 }]}>{item.node.course.courseCode}</Text> */}
                                                    <Text style={[styles.cell, { flex: 5 }]}>{item.node.course.mainCourse.courseName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{mark}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {(mark || 0) >= passLimit ? t("results.pass") : t("results.fail")}
                                                    </Text>
                                                </View>
                                            );
                                        }
                                    })
=======
    <ActivityIndicator />
    :
    !statusPlatform ?
        <Text>{t("results.accountNotActive")}</Text>
        :
        !statusFees ?
            <Text>{t("results.schoolFees")}</Text>
    :
    !statusPublish ?
     <Text>{t("results.resultsNotPublished")}</Text>
     :
     results?.sort((a: EdgeResult, b: EdgeResult) => a.node.course.mainCourse.courseName > b.node.course.mainCourse.courseName ? 1 : a.node.course.mainCourse.courseName < b.node.course.mainCourse.courseName ? -1 : 0)?.map((item, index) => {
         const parsedResults = item.node.infoData
         const { ca, exam, resit } = parsedResults;
         if (result_type === "results") {
             const caPassLimit = (campusInfo?.caLimit || 20) / 2;
             const examPassLimit = (campusInfo?.examLimit || 40) / 2;
             const resitPassLimit = (campusInfo?.resitLimit || 40) / 2;
             const overallPassed = (ca || 0) >= caPassLimit || (exam || 0) >= examPassLimit || (resit || 0) >= resitPassLimit;
             return (
                 <View key={index} style={styles.row}>
                     <Text style={[styles.cell, { flex: 4 }]}>{item.node.course.mainCourse.courseName}</Text>
                     <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{ca}</Text>
                     <Text style={[styles.cell, { flex: 2, textAlign: "center" }]}>{exam}</Text>
                     <Text style={[styles.cell, { flex: 3, textAlign: "center" }]}>{resit || "-"}</Text>
                     <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                         {overallPassed ? t("results.pass") : t("results.fail")}
                     </Text>
                 </View>
             );
         } else {
             const mark = result_type === "ca" ? ca :
                 result_type === "exam" ? exam :
                     result_type === "resit" ? resit : 0;
             const passLimit = result_type === "ca" ? (campusInfo?.caLimit || 20) / 2 :
                 result_type === "exam" ? (campusInfo?.examLimit || 40) / 2 :
                     result_type === "resit" ? (campusInfo?.resitLimit || 40) / 2 : 0;
                     console.log(mark);
             return (
                 <View key={index} style={styles.row}>
                     {/* <Text style={[styles.cell, { flex: 1 }]}>{item.node.course.courseCode}</Text> */}
                     <Text style={[styles.cell, { flex: 5 }]}>{item.node.course.mainCourse.courseName}</Text>
                     <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{mark}</Text>
                     <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                         {(mark || 0) >= passLimit ? t("results.pass") : t("results.fail")}
                     </Text>
                 </View>
             );
         }
     })
>>>>>>> 21f57eb3af9696067a81622704cfa4c63e6f7ada
                }

            </View>
        </View>
    );
}

export default DisplayResults;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 16},
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.border,
        width: "100%"
    },
    rowHeader: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomColor: COLORS.border,
        borderBottomWidth: 1,
        padding: 10,
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    cell: {
        color: COLORS.textDark,
        paddingRight: 1,
        fontWeight: "500",
        justifyContent: "space-between"
    },
});

const GET_FEES = gql`
  query GetData ($userprofileId: Decimal!) {
    allSchoolFees (userprofileId: $userprofileId) {
        edges {
            node {
                id platformPaid balance
                userprofile {
                    specialty { id tuition school { schoolfeesControl }}
                }
            }
        }
    }
}`;

const GET_PUBLISH = gql`
  query GetData ($specialtyId: Decimal!, $semester: String!) {
    allPublishes (specialtyId: $specialtyId, semester: $semester) {
        edges {
            node {
                id ca exam resit
                specialty { mainSpecialty { specialtyName }}
            }
        }
    }
}`;