import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import DisplayResultsSec from './DisplayResultsSec';


const annualsec = () => {

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
        {
          searchResults ?
            <View style={{ marginVertical: 45 }}>
              <ActivityIndicator size="large" />
            </View>

            :

            <DisplayResultsSec
              result_type='annual'
              term=""
              results={section === "secondary" ? dataResults?.allResultsSec?.edges : dataResults?.allResultsPrim?.edges}
              fees={section === "secondary" ? dataResults?.allSchoolFeesSec?.edges[0]?.node : dataResults?.allSchoolFeesPrim?.edges[0]?.node}
              publish={section === "secondary" ? dataResults?.allPublishSec?.edges[0]?.node : dataResults?.allPublishSec?.edges[0]?.node}
            />

        }

      </ScrollView>
    </View>
  );
}

export default annualsec;



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
            avTerm1 avTerm2 avTerm2 avAnnual
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