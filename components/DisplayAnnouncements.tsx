import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeEachWord, removeEmptyFields } from "@/utils/functions";
import { EdgeNotification } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";


const DisplayAnnouncements = (
    { page }:
    { page: "student" | "teacher" }
) => {

  const { t } = useTranslation();
  const { classId, level, role } = useAuthStore();

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: removeEmptyFields({
      specialtyIds: page === "student" ? classId?.toString() : null,
      levelIds: page === "student" ? level : null,
      reciepients: page !== "student" ? role : null
    }),
    skip: !classId || !level,
  });
  console.log(removeEmptyFields({
      specialtyIds: page === "student" ? classId?.toString() : null,
      levelIds: page === "student" ? level : null,
      reciepients: page !== "student" ? role : null
      }))
      console.log(role);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        style={{ marginTop: 100, marginHorizontal: 4, marginBottom: 4 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>{capitalizeEachWord(t("announcements & events"))}</Text>
        <Text style={styles.pageSubtitle}>
          {capitalizeEachWord(t("stay updated with the latest news"))}
        </Text>

        {/* Announcements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="megaphone-outline"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>{capitalizeEachWord(t("latest announcements"))}</Text>
          </View>

          {loading && <Text>{capitalizeEachWord(t("Loading"))}...</Text>}
          {error && <Text>{capitalizeEachWord(t("error fetching notifications"))}</Text>}

          {data?.allNotifications?.edges.map(({ node }: EdgeNotification) => (
            <View key={node.id} style={styles.announcementCard}>

              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.eventTitle}>
                  <Ionicons
                    name="notifications-outline"
                    size={18}
                    color={COLORS.primary}
                    style={{ marginRight: 6 }}
                  />
                  {node.subject}
                </Text>
                <Text style={[styles.announcementText, { marginRight: 6 }]}>
                  {node.message}
                </Text>
                {/* Optionally add createdAt if available */}
                {node.updatedAt && (
                  <Text style={styles.eventTime}>
                    {new Date(node.updatedAt).toLocaleString()}
                  </Text>
                )}
              </View>
            </View>
          ))}

        </View>

        {/* Events Timeline */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>{capitalizeEachWord(t("upcoming events"))}</Text>
          </View>

          <View style={styles.timeline}>
            <Text></Text>
          </View>
        </View> */}

      </ScrollView>

    </View>
  );
};

export default DisplayAnnouncements;


const GET_DATA = gql`
  query GetStudentCourses(
    $specialtyIds: String
    $levelIds: String
    $recipients: String
  ) {
    allNotifications(
      last: 10,
      specialtyIds: $specialtyIds,
      levelIds: $levelIds
      recipients: $recipients
  ) {
      edges {
        node {
          id
          message
          notificationType
          sent
          subject
          updatedAt
        }
      }
    }
  }
`;



const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.textDark,
  },
  announcementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  announcementText: {
    fontSize: 15,
    color: COLORS.textDark,
    flex: 1,
    lineHeight: 20,
  },
  timeline: {
    marginTop: 6,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 12,
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: "center"
  },
  eventTime: {
    textAlign: "right",
    fontSize: 13,
    color: COLORS.textPrimary,
  },
});