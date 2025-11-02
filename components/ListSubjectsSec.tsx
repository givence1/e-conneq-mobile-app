import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeEachWord, getAcademicYear } from "@/utils/functions";
import { EdgeSubjectSec, EdgeSubSubjectSec } from "@/utils/schemas/interfaceGraphqlSecondary";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const ListSubjectsSec = ({
  loading,
  error,
  subjects,
  subsubjects,
  apiYears,
}: {
  loading: boolean;
  error: any;
  subjects: EdgeSubjectSec[];
  subsubjects: EdgeSubSubjectSec[];
  apiYears?: string[];
}) => {
  const { t } = useTranslation();
  const { role } = useAuthStore();
  const [tab, setTab] = useState<"main" | "minor">("main");
  const [selectedYear, setSelectedYear] = useState(getAcademicYear());

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>{t("subject.loadError")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {role !== "student" && (
          <View style={styles.selectWrapper}>
            <SelectPicker
              selectedValue={selectedYear}
              onValueChange={(v) => setSelectedYear(v)}
              style={styles.selectPicker}
              dropdownIconColor={COLORS.textSecondary}
            >
              <SelectPicker.Item label="-----------" value="" />
              {apiYears?.map((y: string) => (
                <SelectPicker.Item key={y} label={y} value={y} />
              ))}
            </SelectPicker>
          </View>
        )}

        <View style={styles.tabContainer}>
          <Text style={styles.title}>{capitalizeEachWord(t("my subjects"))}</Text>

          <View style={styles.tabWrapper}>
            {["main", "minor"].map((type: any) => (
              <Text
                key={type}
                onPress={() => setTab(type)}
                style={[
                  styles.tabItem,
                  tab === type && styles.activeTabItem,
                ]}
              >
                {capitalizeEachWord(t(type === "main" ? "main subjects" : "minor subjects"))}
              </Text>
            ))}
          </View>
        </View>


        {tab === "main" ? (
          subjects?.filter(
            (s: EdgeSubjectSec) => s.node.classroomsec?.academicYear === selectedYear
          )?.length > 0 ? (
            <View style={styles.subjectList}>
              {subjects.map((subj, index) => {
                const subject = subj.node;
                return (
                  <View key={subject.id} style={styles.subjectCard}>
                    <Text style={styles.subjectTitle}>
                      {index + 1}. {subject.mainsubject.subjectName}
                    </Text>
                    <Text style={styles.subjectCode}>
                      Code: {subject.mainsubject.subjectCode} • Coeff:{" "}
                      {subject.subjectCoefficient}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={{ color: "red" }}>
                {capitalizeEachWord(t("no main subjects found"))}
              </Text>
            </View>
          )
        ) 
        
        : 
        
        subsubjects?.filter(
          (s: EdgeSubSubjectSec) =>
            s.node.subjectsec?.classroomsec?.academicYear === selectedYear
        )?.length > 0 ? (
          <View style={styles.subjectList}>
            {subsubjects?.map((subj, index) => {
              const sub = subj.node;
              return (
                <View key={sub?.subjectsec?.id} style={styles.subjectCard}>
                  <Text style={styles.subjectTitle}>
                    {index + 1}. {sub?.subjectsec?.mainsubject.subjectName}
                  </Text>
                  <Text style={styles.subjectCode}>
                    Code: {sub?.subjectsec?.mainsubject.subjectCode} • Coeff:{" "}
                    {sub?.subjectsec?.subjectCoefficient}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={{ color: "red" }}>
              {capitalizeEachWord(t("no minor subjects found"))}
            </Text>
          </View>
        )}


      </ScrollView>
    </View>
  );
};

export default ListSubjectsSec;

const styles = StyleSheet.create({

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 16,
  },
  selectWrapper: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.cardBackground,
    marginBottom: 16,
  },
  selectPicker: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  subjectList: {
    gap: 12,
  },
  subjectCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subjectCode: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  minorContainer: {
    marginTop: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
  },
  minorTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  minorItem: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
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