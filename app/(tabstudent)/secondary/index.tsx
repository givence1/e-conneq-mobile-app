import HomePage from "@/components/HomePage";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const StudentHome = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.username}>{(user as any)?.firstName || "Student"}</Text>

        {/* 🔍 Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, assignments..."
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* 🔹 Main Body (scrollable white section) */}
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Today's Classes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Deadlines</Text>
          </View>
        </View>

        {/* Today's Schedule */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <Text style={styles.sectionSubtitle}>Monday, Nov 14</Text>

        {/* Schedule Card */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleLeft}>
            <Ionicons name="book-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.courseTitle}>Cognitive Neuroscience</Text>
            <View style={styles.courseInfoRow}>
              <Ionicons name="time-outline" size={15} color="#555" />
              <Text style={styles.courseInfoText}> 10:00 AM - 11:30 AM</Text>
            </View>
            <View style={styles.courseInfoRow}>
              <Ionicons name="location-outline" size={15} color="#555" />
              <Text style={styles.courseInfoText}>
                {" "}
                Science Bldg, Room 305 - Dr. Miller
              </Text>
            </View>

            <View style={styles.statusTag}>
              <Text style={styles.statusText}>Now</Text>
            </View>
          </View>
        </View>

        {/* You can render dynamic content below */}
        <HomePage />
      </ScrollView>
    </View>
  );
};

export default StudentHome;

// 🎨 Styles
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#003366",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: "#FFDD00",
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 8,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0B4F91",
    paddingVertical: 20,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    color: "#D0D8E2",
    fontSize: 13,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 24,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  scheduleCard: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 4,
  },
  scheduleLeft: {
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  courseInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  courseInfoText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  statusTag: {
    alignSelf: "flex-start",
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
