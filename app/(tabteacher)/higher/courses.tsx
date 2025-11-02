import ListCourses from "@/components/ListCourses";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import React from "react";


const CoursesScreen = () => {
  const { user } = useAuthStore();

  const { data, loading, error } = useQuery(GET_COURSES, {
    variables: {
      assignedToId: Number(user?.user_id)
    },
    skip: !user?.user_id,
  });

  return <>
    <ListCourses
      courses={data?.allCourses?.edges}
      loading={loading}
      error={error}
      apiYears={data?.allAcademicYears}
    />
  </>
}

export default CoursesScreen


const GET_COURSES = gql`
  query GetStudentCourses(
    $assignedToId: Decimal!
  ) {
    allAcademicYears
    allCourses(
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
          }
          mainCourse {
            courseName
          }
        }
      }
    }
  }
`;