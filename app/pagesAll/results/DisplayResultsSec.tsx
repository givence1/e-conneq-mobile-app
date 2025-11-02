import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { removeUnderscoreKeys } from '@/utils/functions';
import { EdgeResultSecondary, NodePublishSecondary, NodeSchoolFeesSec } from '@/utils/schemas/interfaceGraphqlSecondary';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';


const DisplayResultsSec = (
    { result_type, results, term, publish, fees }:
        {
            result_type: "term" | "annual" | any,
            results: EdgeResultSecondary[],
            publish: NodePublishSecondary,
            fees: NodeSchoolFeesSec,
            term: "term_1" | "term_2" | "term_3" | string,
        }
) => {
    const { t } = useTranslation();
    const { campusInfo } = useAuthStore();
    const [statusPlatform, setStatusPlatform] = useState<boolean>(false)
    const [statusFees, setStatusFees] = useState<boolean>(false)

    const pub = removeUnderscoreKeys(publish.publishSeq);

    const getTermSequences = () => {
        if (term === "term_1") return ["seq1", "seq2"];
        if (term === "term_2") return ["seq3", "seq4"];
        if (term === "term_3") return ["seq5", "seq6"];
        return [];
    };

    const visibleSeqs = getTermSequences().filter((seq) => pub[seq]);
    console.log(visibleSeqs);


    useEffect(() => {
        if (fees) {
            const tuition: number = fees?.userprofilesec?.classroomsec?.tuition
            const balance: number = fees?.balance;
            const paid: number = tuition > 0 ? (tuition - balance) / (tuition) : 0;

            let feesControl = fees?.userprofilesec?.classroomsec?.school?.schoolfeesControl
                ?.split(", ")
                .map(Number)
                .filter((item: any) => !isNaN(item)) || [];

            let tuitionControl = -1;

            const seqOrder = ["seq1", "seq2", "seq3", "seq4", "seq5", "seq6"];

            seqOrder.forEach((seqKey, idx) => {
                if (pub[seqKey] === true && feesControl[idx] !== undefined) {
                    tuitionControl = feesControl[idx];
                }
            });

            setStatusPlatform(fees.platformPaid);
            setStatusFees(paid >= tuitionControl);
        }
    }, [term, result_type]);


    return (
        <View>
            {/* <Text style={styles.title}>{title}</Text> */}

            <View style={styles.table}>
                <View style={styles.rowHeader}>
                    <Text style={[styles.headercell, { flex: result_type === "annual" ? 6 : result_type === "term" ? 5 : 4 }]}>{t("results.subject")}</Text>
                    {result_type === "sequence" ?
                        <>
                            {/* <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{sequence?.toUpperCase()}</Text> */}
                            <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{t("results.status")}</Text>
                        </>
                        : result_type === "term" ?
                            <>
                                {visibleSeqs?.map((seq, idx) => (
                                    <Text key={seq} style={[styles.headercell, { flex: 1, textAlign: "center" }]}>
                                        {`S${idx + 1}`}
                                    </Text>
                                ))}
                                <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>
                                    {t("results.status")}
                                </Text>
                            </>
                            :
                            result_type === "annual" ?
                                <>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>T1</Text>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>T2</Text>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>T3</Text>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{t("results.status")}</Text>
                                </>
                                :
                                null
                    }
                </View>

                {
                    !visibleSeqs ?
                        <ActivityIndicator />
                        :
                        !statusPlatform ?
                            <Text style={{ textAlign: "center", paddingVertical: 5, marginVertical: 30, color: "red", fontWeight: 500, fontSize: 16 }}>{t("results.accountNotActive")}</Text>
                            :
                            !statusFees ?
                                <Text style={{ textAlign: "center", paddingVertical: 5, marginVertical: 30, color: "red", fontWeight: 500, fontSize: 16 }}>{t("results.schoolFees")}</Text>
                                :
                                visibleSeqs.length < 1 ?
                                    <Text style={{ textAlign: "center", paddingVertical: 5, marginVertical: 30, color: "red", fontWeight: 500, fontSize: 16 }}>{t("results.resultsNotPublished")}</Text>
                                    :
                                    results &&
                                    results
                                    // ?.sort((a: EdgeResultSecondary, b: EdgeResultSecondary) => a?.node?.subjectsec?.mainsubject?.subjectName > b.node.subjectsec?.mainsubject?.subjectName ? 1 : a.node.subjectsec?.mainsubject?.subjectName < b.node.subjectsec?.mainsubject?.subjectName ? -1 : 0)
                                    ?.map((item, index) => {
                                        const parsedResults = item.node.infoData

                                        if (result_type === "term") {
                                            const seqPassLimit = (campusInfo?.seqLimit || 20) / 2;
                                            const overallPassed =
                                                term === "term_1"
                                                    ? parsedResults?.avTerm1 || 0 >= seqPassLimit
                                                    : term === "term_2"
                                                        ? parsedResults.avTerm2 || 0 >= seqPassLimit
                                                        : parsedResults.avTerm3 || 0 >= seqPassLimit;

                                            return (
                                                <View key={index} style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 5 }]}>
                                                        {item.node.subjectsec?.mainsubject?.subjectName}
                                                    </Text>

                                                    {visibleSeqs.map((seq) => (
                                                        <Text key={seq} style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                            {parsedResults[seq] ?? "-"}
                                                        </Text>
                                                    ))}

                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {term === "term_1"
                                                            ? parsedResults.avTerm1
                                                            : term === "term_2"
                                                                ? parsedResults.avTerm2
                                                                : parsedResults.avTerm3}
                                                        {"  "}
                                                        <Text
                                                            style={{
                                                                fontStyle: "italic",
                                                                color: overallPassed ? "green" : "red",
                                                            }}
                                                        >
                                                            {term === "term_1"
                                                                ? parsedResults.grade1
                                                                : term === "term_2"
                                                                    ? parsedResults.grade2
                                                                    : parsedResults.grade3}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            );
                                        } else if (result_type === "annual") {
                                            const seqPassLimit = (campusInfo?.seqLimit || 20) / 2;
                                            const overallPassed = parsedResults.avAnnual || 0 >= seqPassLimit;

                                            return (
                                                <View key={index} style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 6 }]}>{item.node.subjectsec?.mainsubject?.subjectName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {parsedResults.avTerm1}
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {parsedResults.avTerm2}
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {parsedResults.avTerm3}
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {overallPassed ? t("results.pass") : t("results.fail")}
                                                    </Text>
                                                </View>
                                            );
                                        }
                                    })
                }

            </View>
        </View>
    );
}

export default DisplayResultsSec;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
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
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    headercell: {
        color: COLORS.white,
        paddingRight: 1,
        fontWeight: "500",
        justifyContent: "space-between"
    },
    cell: {
        color: COLORS.black,
        paddingRight: 1,
        fontWeight: "500",
        justifyContent: "space-between"
    },
});