import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeEachWord } from "@/utils/functions";
import { NodeCourse } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Detail from "./Detail";
import Display from "./Display";


const Index = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const [showDetail, setShowDetail] = useState<{ show: boolean, selectedItem: NodeCourse | null }>({ show: false, selectedItem: null });

    const { data, loading, error, refetch } = useQuery(GET_COURSES, {
        variables: {
            assignedToId: Number(user?.user_id)
        },
        skip: !user?.user_id,
    });

    return <View style={{ flex: 1, backgroundColor: COLORS.background }}>

        <AppHeader showBack showTitle />

        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    color: "#0066cc",
                    marginVertical: 8,
                }}
            >
                {capitalizeEachWord(t("courses.material"))}
            </Text>

            {
                loading ?
                    <View>
                        <ActivityIndicator />
                    </View>

                    :

                    (showDetail?.show && showDetail?.selectedItem?.id) ?
                        <Detail
                            course={showDetail.selectedItem}
                            setShowDetail={setShowDetail}
                            refetch={refetch}
                        />

                        :

                        <Display
                            courses={data?.allCourses?.edges}
                            loading={loading}
                            error={error}
                            apiYears={data?.allAcademicYears}
                            setShowDetail={setShowDetail}
                        />
            }


        </ScrollView>
    </View>
}

export default Index


const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 90, // space for TabsHeader
    },
});


const GET_COURSES = gql`
query GetStudentCourses(
    $assignedToId: Decimal!
) {
    allAcademicYears
    allCourses (
        assignedToId: $assignedToId
    ) {
        edges {
            node {
                id
                courseCode
                semester
                specialty {
                    id
                    academicYear
                    mainSpecialty { specialtyName }
                    level { level }
                }
                mainCourse {
                    courseName
                } 
                fileCa fileExam fileOutline fileResit
                fileStatusCa fileStatusExam fileStatusOutline fileStatusResit
            }
        }
    }
}`;
