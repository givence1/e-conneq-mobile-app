import HomePage from "@/components/HomePage";
import ProfileHeader from "@/components/ProfileHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
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
  const { user, section, feesId } = useAuthStore();
  const [search, setSearch] = useState("");

  // ✅ Use only this one
  const { data: dataFees } = useQuery(GET_FEES, {
    variables: { id: feesId },
    skip: !feesId,
  });

  const profileData = {
    fees:
      section === "higher"
        ? dataFees?.allSchoolFees?.edges[0]
        : section === "secondary"
        ? dataFees?.allSchoolFeesSec?.edges[0]
        : section === "primary"
        ? dataFees?.allSchoolFeesPrim?.edges[0]
        : dataFees?.allSchoolFees?.edges[0],
    user,
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.username}>{user?.username}</Text>

         {/* 👇 Profile Info inside Header */}
        <View style={{ marginTop: 16 }}>
          <ProfileHeader fees={profileData.fees} user={profileData.user as any} />
        </View>

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

      {/* 🔹 Main Body */}
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Stats */}
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

        {/* Schedule */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <Text style={styles.sectionSubtitle}>Monday, Nov 14</Text>

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
                Science Bldg, Room 305 - Dr. Miller
              </Text>
            </View>
            <View style={styles.statusTag}>
              <Text style={styles.statusText}>Now</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Home Section */}
        <HomePage showProfileHeader={false} />
      </ScrollView>
    </View>
  );
};

export default StudentHome;

const GET_FEES = gql`
  query GetData($id: ID!) {
    allSchoolFees(id: $id) {
      edges {
        node {
          id
          platformPaid
          userprofile {
            id
            program {
              name
            }
            customuser {
              id
              matricle
              preinscriptionStudent {
                fullName
              }
            }
          }
        }
      }
    }
    allSchoolFeesSec(id: $id) {
      edges {
        node {
          id
          platformPaid
          userprofilesec {
            id
            programsec
            customuser {
              id
              matricle
              preinscriptionStudent {
                fullName
              }
            }
            classroomsec {
              academicYear
              level
              classType
              series {
                name
              }
            }
          }
        }
      }
    }
    allSchoolFeesPrim(id: $id) {
      edges {
        node {
          id
          platformPaid
          userprofileprim {
            id
            programprim
            customuser {
              id
              matricle
              preinscriptionStudent {
                fullName
              }
            }
            classroomprim {
              academicYear
              level
              classType
            }
          }
        }
      }
    }
  }
`;



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

