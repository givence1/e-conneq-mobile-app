import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { EdgeResult } from '@/utils/schemas/interfaceGraphql';
import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import StudentResultsUpload from './StudentResultsUpload';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/utils/interfaces';
import { useAuthStore } from '@/store/authStore';

const Index = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const user: JwtPayload | null = token ? jwtDecode(token) : null;
  const route = useRoute();
  const params: any = route.params || {};
  const [dataToSubmit, setDataToSubmit] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { data: dataResults, loading: loadingResults, refetch } = useQuery(GET_RESULTS, {
    variables: { id: parseInt(params.courseId), courseId: params?.courseId },
  });

  const handleSubmit = async (updatedResults: EdgeResult[]) => {
    setSubmitting(true);
    console.log('Updated results:', updatedResults);

    const newData = {
      byId: user?.user_id,
      courseId: parseInt(params.courseId),
      results: JSON.stringify(dataToSubmit),
    };

    const res = await ApiFactory({
      newData,
      editData: newData,
      mutationName: "bulkCreateUpdateResultsForCourse",
      modelName: "updatedResults",
      successField: "ok",
      query,
      router: null,
      params,
      returnResponseField: false,
      returnResponseObject: true,
      redirect: false,
      reload: false,
      redirectPath: "",
      actionLabel: "processing",
      token
    });

    if (res?.ok) {
      refetch();
      setSubmitting(false);
      alert("Operation Successful ✅");
      setDataToSubmit([])
    } else {
      setSubmitting(false);
      alert("Operation Failed ❌ - " + res?.message);
    }
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
            course={dataResults?.allCourses?.edges[0]?.node}
            results={dataResults?.allResults?.edges}
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
    paddingTop: 90, // space for TabsHeader
  },
});

const GET_RESULTS = gql`
  query GetData($id: ID!, $courseId: Decimal!) {
    allCourses(id: $id) {
      edges {
        node {
          id
          semester
          mainCourse {
            courseName
          }
          specialty {
            academicYear
            level {
              level
            }
          }
        }
      }
    }
    allResults(courseId: $courseId) {
      edges {
        node {
          id
          infoData {
            ca exam resit average validated
          }
          student {
            id
            customuser {
              fullName
              matricle
            }
          }
          course {
            courseCode
            semester
            mainCourse {
              courseName
            }
            specialty {
              id
              academicYear
              mainSpecialty {
                specialtyName
              }
              level {
                level
              }
            }
          }
        }
      }
    }
  }
`;


const query = gql`
  mutation BulkResults(
      $byId: Int!
      $courseId: Int!
      $results: String!
  ) {
    bulkCreateUpdateResultsForCourse(
        byId: $byId
        courseId: $courseId
        results: $results
    ) {
        ok
        message
        updatedResults
    }
  }
`;