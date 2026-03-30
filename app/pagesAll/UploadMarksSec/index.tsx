import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { capitalizeEachWord, decodeUrlID } from '@/utils/functions';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { JwtPayload } from '@/utils/interfaces';
import { EdgeSubjectSec } from '@/utils/schemas/interfaceGraphqlSecondary';
import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import StudentResultsUpload from './StudentResultsUpload';


const Index = () => {
  const { t } = useTranslation();
  const { token, campusInfo } = useAuthStore();
  const user: JwtPayload | null = token ? jwtDecode(token) : null;
  const route = useRoute();
  const params: any = route.params || {};
  const [dataToSubmit, setDataToSubmit] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data: dataResults, loading: loadingResults, refetch } = useQuery(GET_RESULTS_AND_PROFILES, {
    variables: {
      id: parseInt(params.subjectId),
      classroomsecId: params?.classroomsecId,
      schoolId: parseInt(decodeUrlID(campusInfo?.id || "") || ""),
      subjectId: params.subjectId
    },
  });

  const handleSubmit = async () => {
    setSubmitting(true);

    const newData = {
      byId: user?.user_id,
      subjectId: parseInt(params.subjectId),
      results: JSON.stringify(
        dataToSubmit.map((item: any) => {
          const newInfoData: Record<string, any> = {};

          const source = item.newInfoData || {};

          Object.entries(source).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              let newKey = key;

              if (/^seq\d+$/.test(key)) {
                newKey = key.replace(/^seq(\d+)$/, 'seq_$1');
              }
              if (/^exam\d+$/.test(key)) {
                newKey = key.replace(/^exam(\d+)$/, 'exam_$1');
              }

              newInfoData[newKey] = value;
            }
          });

          return {
            studentId: item.studentId,
            newInfoData,
          };
        })
      ),
    };

    const res = await ApiFactory({
      newData,
      editData: newData,
      mutationName: "bulkCreateUpdateResultsForSubject",
      modelName: "updatedResults",
      successField: "ok",
      query,
      router: null,
      params,
      returnResponseField: false,
      returnResponseObject: true,
      redirect: false,
      reload: true,
      redirectPath: "",
      actionLabel: "processing",
      token
    });

    if (res?.ok) {
      refetch();
      Alert.alert(
        capitalizeEachWord(t('operation successful')) + " ✅"
      );
    } else {
      alert(capitalizeEachWord(t("operation failed")) + " ❌ - " + res?.message);
    }
    setSubmitting(false);
    setDataToSubmit([])
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>

      <AppHeader showBack showTitle />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loadingResults || submitting ? (
          <ActivityIndicator />
        ) : dataResults ? (
          <StudentResultsUpload
            subjectsec={dataResults?.allSubjectsSec?.edges.filter((s: EdgeSubjectSec) => decodeUrlID(s.node.id) === params.subjectId)[0].node}
            results={dataResults?.allResultsSec?.edges}
            apiProfiles={dataResults?.allUserprofilesSec?.edges}
            onSubmit={handleSubmit}
            dataToSubmit={dataToSubmit}
            setDataToSubmit={setDataToSubmit}
            type={params.type.toLowerCase()}
          />
        ) : (
          <Text>{t("results.noData")}</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 100,
  },
});

const GET_RESULTS_AND_PROFILES = gql`
  query GetData(
    $classroomsecId: Decimal!,
    $schoolId: Decimal!,
    $subjectName: String,
    $subjectId: Decimal!,
  ) {
    allSubjectsSec(
      classroomsecId: $classroomsecId
      schoolId: $schoolId
      subjectName: $subjectName
    ){
      edges {
        node {
          id subjectCoefficient hasSubSubjects
          subsubjectList { id name assignedTo { id } }
          mainsubject { id subjectName subjectCode }
          classroomsec { id academicYear stream level tuition }
          assignedTo { firstName }
          assignedToTwo { firstName }
        }
      }
    }
    allUserprofilesSec (
      classroomsecId: $classroomsecId
      schoolId: $schoolId
    ){
      edges {
        node {
          id
          customuser {
            preinscriptionStudent { fullName }
          }
        }
      }
    }
    allResultsSec(
      subjectId: $subjectId
      schoolId: $schoolId
    ){
      edges {
        node {
          id
          subjectsec { id mainsubject { subjectName subjectCode }}
          student { 
            id
            customuser { 
              matricle
              preinscriptionStudent { fullName }
            }
          }
          infoData {
            seq1 seq2 seq3 seq4 seq5 seq6
            seq1a seq2a seq3a seq4a seq5a seq6a
            seq1b seq2b seq3b seq4b seq5b seq6b
            seq1c seq2b seq3b seq4b seq5b seq6c
            seq1d seq2b seq3b seq4b seq5b seq6d
          }
        }
      }
    }
    allAcademicYearsSec
  }
`;


const query = gql`
  mutation BulkResults(
      $byId: Int!
      $subjectId: Int!
      $results: String!
  ) {
    bulkCreateUpdateResultsForSubject(
        byId: $byId
        subjectId: $subjectId
        results: $results
    ) {
        ok
        message
        updatedResults
    }
  }
`;