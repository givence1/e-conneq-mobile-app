import DisplayResultsSec from "@/app/pagesAll/results/DisplayResultsSec";
import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    View
} from "react-native";


const ResultSec = (
    { result_type, term }:
        {
            result_type: "sequence" | "term" | "annual" | string,
            term: "term_1" | "term_2" | "term_3" | string,
        }
) => {
    const { t } = useTranslation();
    const { section, profileId, classId } = useAuthStore();

    const { data: dataResults, loading: searchResults } = useQuery(GET_RESULTS, {
        variables: {
            studentId: profileId,
            classroomsecId: classId,
        },
    });

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* ✅ Fixed header outside the ScrollView */}
            <AppHeader showBack showTitle />

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.scrollContent, { paddingTop: 80 }]}
                showsVerticalScrollIndicator={false}
            >
                {!searchResults ?
                    <DisplayResultsSec
                        result_type={result_type}
                        term={term}
                        results={dataResults?.allResultsSec?.edges}
                        publish={dataResults?.allPublishSec?.edges[0]?.node}
                        fees={dataResults?.allSchoolFeesSec?.edges[0]?.node}
                    />
                    :
                    <View style={{ marginVertical: 25 }}>
                        <ActivityIndicator size="large" />
                    </View>
                }
            </ScrollView>
        </View>
    );
}

export default ResultSec

const GET_RESULTS = gql`
query GetData(
    $studentId: Decimal!
    $classroomsecId: Decimal!
) {
    allSchoolFeesSec (
        userprofilesecId: $studentId
    ) {
        edges {
            node {
                id platformPaid balance
                userprofilesec {
                    classroomsec { id tuition school { schoolfeesControl }}
                }
            }
        }
    }
    allPublishSec (
          classroomsecId: $classroomsecId
    ) {
        edges {
            node {
                id
                publishSeq { 
                    seq1 seq2 seq3 seq4 seq5 seq6
                }
            }
        }
    }
    allResultsSec(
      studentId: $studentId
    ) {
      edges {
        node {
          id
          student {
            customuser {
              matricle
              preinscriptionStudent {
                fullName
              }
            }
          }
          subjectsec {
            mainsubject {
              subjectName
              subjectCode
            }
          }
          infoData {
            seq1 seq2 seq3 seq4 seq5 seq6
            avTerm1 avTerm2 avTerm3
            }
        }
      }
    }
  }
`;



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 16, borderRadius: 50 },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 60,
    },
    dropdownWrapper: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.cardBackground,
        marginBottom: 20,
    },
    picker: {
        height: 50,
        paddingHorizontal: 1,
        color: COLORS.textPrimary,
    },
    pickerItem: {
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    optionPlaceholder: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    optionItem: {
        fontSize: 16,
        color: COLORS.textDark,
    },
});