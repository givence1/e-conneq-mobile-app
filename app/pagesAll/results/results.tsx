import AppHeader from "@/components/AppHeader";
import MyTab from "@/components/MyTab";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DisplayResults from "./DisplayResults";

// Exam Results screen for Higher Education
export default function ExamResults() {
  const [tab, setTab] = useState<"I" | "II">("I");
  const { profileId } = useAuthStore();
  const { t } = useTranslation(); // ✅ no "ui"

  const { data: dataResults, loading: searchResults, error } = useQuery(
    GET_EXAM_RESULTS,
    {
      variables: {
        studentId: profileId,
      },
    }
  );
  const [resultList, setResultList] = useState<EdgeResult[]>();

  useEffect(() => {
    if (tab && dataResults?.allResults?.edges?.length) {
      const fil = dataResults?.allResults?.edges.filter(
        (item: EdgeResult) =>
          item.node?.course?.semester === tab && item.node?.publishExam
      );
      setResultList(fil);
    }
  }, [tab, dataResults]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ Fixed header outside the ScrollView */}
      <AppHeader showBack showTitle />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 65 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SEMESTER PICKER */}
        <MyTab
          value={tab}
          tabs={["I", "II"]}
          onChange={setTab}
        />

        {/* Results */}
        {!searchResults ? (
          <DisplayResults
            title={t("results.all")}
            result_type="results"
            results={resultList}
            semester={tab}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
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

  tabContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 4,
    marginTop: 8,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabItem: {
    backgroundColor: COLORS.primary,
    color: "#fff",
  },
});

const GET_EXAM_RESULTS = gql`
  query GetData($studentId: Decimal!) {
    allResults(studentId: $studentId) {
      edges {
        node {
          id
          student {
            customuser {
              fullName
            }
          }
          course {
            mainCourse {
              courseName
            }
            semester
            courseCode
          }
          infoData {
            ca exam resit average
          }
          publishExam
        }
      }
    }
  }
`;