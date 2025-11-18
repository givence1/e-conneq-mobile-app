import { EdgeResult } from '@/utils/schemas/interfaceGraphql';
import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import StudentResultsUpload from '../higher/markupload/UploadMarks/StudentResultsUpload';

const Index = () => {
    const route = useRoute();
    const params: any = route.params || {};
    console.log(params?.courseId);

    console.log(params);
    const { data: dataResults, loading: loadingResults } = useQuery(GET_RESULTS, {
        variables: { id: parseInt(params.courseId), courseId: params?.courseId },
    });
    console.log(dataResults);
    const handleSubmit = (updatedResults: EdgeResult[]) => {
        // Here you would typically send the updated results to your backend
        console.log('Updated results:', updatedResults);
        // setResults(updatedResults);
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {loadingResults ?
                <ActivityIndicator />
                :
                <StudentResultsUpload
                    course={dataResults?.allCourses?.edges[0]?.node}
                    results={dataResults?.allResults?.edges}
                    onSubmit={handleSubmit}
                    type={params.type.toLowerCase()}
                />}
        </ScrollView>
    );
}

export default Index;

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 90, // space for TabsHeader
    },
})



const GET_RESULTS = gql`
  query GetData (
    $id: ID!
    $courseId: Decimal!
  ) {
    allCourses (
        id: $id
    ) {
        edges {
            node {
                id semester
                mainCourse { courseName }
                specialty { academicYear level { level }}
            }
        }
    }
    allResults (
        courseId: $courseId
    ) {
        edges {
            node {
                id infoData
                student { id customuser { fullName matricle }}
                course { 
                    courseCode semester
                    mainCourse { courseName }
                    specialty { id academicYear
                        mainSpecialty { specialtyName }
                        level { level }
                    }
                }
            }
        }
    }
}`