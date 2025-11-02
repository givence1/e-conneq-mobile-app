import ListSubjectsSec from "@/components/ListSubjectsSec";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import React from "react";


const SubjectScreen = () => {
  const { user } = useAuthStore();

  const { data, loading, error } = useQuery(GET_SUBJECTS, {
    variables: {
      assignedToId: Number(user?.user_id)
    },
    skip: !user?.user_id,
  });

  return <ListSubjectsSec
    subjects={data?.allSubjectsSec?.edges}
    subsubjects={data?.allSubSubjectSec?.edges}
    loading={loading}
    error={error}
    apiYears={data?.allAcademicYears}
  />
}

export default SubjectScreen


const GET_SUBJECTS = gql`
  query GetData(
    $assignedToId: Decimal!
  ) {
    allAcademicYears
    allSubjectsSec(
      assignedToId: $assignedToId
    ) {
      edges {
        node {
          id
          subjectCoefficient
          classroomsec { academicYear }
          mainsubject {
            subjectCode
            subjectName
          }
        }
      }
    }
    allSubSubjectSec (
      assignedToId: $assignedToId
    ) {
      edges {
        node {
          id
          name
          subjectsec {
            classroomsec { academicYear }
            mainsubject {
              subjectCode
              subjectName
            }
          }
        }
      }
    }
  }
`;