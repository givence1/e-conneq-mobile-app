import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import DisplayResults from "./DisplayResults";

export default function CAResults() {
  const { t } = useTranslation(); 
  const [semester, setSemester] = useState<"I" | "II" | null>(null);
  const { profileId } = useAuthStore();

  const { data: dataResults, loading: searchResults } = useQuery(GET_RESULTS, {
    variables: {
      studentId: profileId,
    },
  });

  const [resultList, setResultList] = useState<EdgeResult[]>();

  useEffect(() => {
    if (semester && dataResults?.allResults?.edges?.length) {
      const fil = dataResults?.allResults?.edges.filter(
        (item: EdgeResult) => item.node?.course?.semester === semester
      );
      setResultList(fil);
    }
  }, [semester]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ Fixed header outside the ScrollView */}
      <AppHeader showBack showTitle />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 65 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Semester Picker */}
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={semester}
            onValueChange={(value) => setSemester(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={COLORS.primary}
          >
            <Picker.Item
              label={t("results.selectSemester")}
              value={null}
              style={styles.optionPlaceholder}
            />
            <Picker.Item
              label={t("results.semester1")}
              value="I"
              style={styles.optionItem}
            />
            <Picker.Item
              label={t("results.semester2")}
              value="II"
              style={styles.optionItem}
            />
          </Picker>
        </View>

        {/* ✅ Results or Loading */}
        {!searchResults ? (
          <DisplayResults
            title={t("results.caTitle")}
            result_type="ca"
            results={resultList}
            semester={semester}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16, borderRadius:50 },
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

const GET_RESULTS = gql`
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
          infoData
          publishCa
          publishExam
          publishResit
        }
      }
    }
  }
`;