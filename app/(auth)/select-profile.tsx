import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { decodeUrlID } from "@/utils/functions";
import {
  EdgeCustomUser,
  EdgeSchoolFees,
  NodeCustomUser,
  NodeSchoolHigherInfo,
} from "@/utils/schemas/interfaceGraphql";
import { EdgeSchoolFeesPrim } from "@/utils/schemas/interfaceGraphqlPrimary";
import { EdgeSchoolFeesSec } from "@/utils/schemas/interfaceGraphqlSecondary";
import { gql, useQuery } from "@apollo/client";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Colors per section
const sectionColors = {
  higher: { bg: "#E3F2FD", text: "#1565C0" }, // Blue
  secondary: { bg: "#E8F5E9", text: "#2E7D32" }, // Green
  primary: { bg: "#FFF3E0", text: "#E65100" }, // Orange
};

export default function SelectYearScreen(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    user,
    role,
    parentNumber,
    storeFeesId,
    storeProfileId,
    storeClassId,
    storeLevel,
    storeCampusInfo,
    storeSection,
  } = useAuthStore();

  const [selectedChild, setSelectedChild] = useState<NodeCustomUser | null>();
  const [showProfile, setShowProfile] = useState(false);

  // Queries
  const { data: dataChildren } = useQuery(GET_CHILDREN, {
    variables: { parentTelephone: parentNumber },
    skip: !(role === "parent" && (parentNumber?.toString()?.length || 0) > 6),
  });

  const { data: dataProfiles } = useQuery(GET_PROFILES, {
    variables: { customuserId: user?.user_id },
    skip: !user?.user_id,
  });

  const {
    data: dataProfilesSelectedChild,
    loading: loadingSelectedProfiles,
    refetch,
  } = useQuery(GET_PROFILES, {
    variables: { customuserId: decodeUrlID(selectedChild?.id || "") },
    skip: !decodeUrlID(selectedChild?.id || ""),
  });

  // ✅ Store selected data
  const handleSelect = (
    item: EdgeSchoolFees | EdgeSchoolFeesSec | EdgeSchoolFeesPrim,
    section: "higher" | "secondary" | "primary"
  ): void => {
    const feesId = parseInt(decodeUrlID(item.node.id.toString()) || "0", 10);
    if (!isNaN(feesId)) storeFeesId(feesId);

    let profileId: string | undefined;
    let classId: string | undefined;
    let level: string = "";
    let campus: NodeSchoolHigherInfo | undefined;

    if ("userprofile" in item.node) {
      profileId = item.node.userprofile?.id?.toString();
      classId = item.node.userprofile?.specialty?.id?.toString();
      level = decodeUrlID(item.node.userprofile?.specialty?.level?.id) || "";
      campus = item.node.userprofile?.specialty?.school;
    } else if ("userprofilesec" in item.node) {
      profileId = item.node.userprofilesec?.id?.toString();
      classId = item.node.userprofilesec?.classroomsec?.id?.toString();
      level = item.node.userprofilesec?.classroomsec?.level;
      campus = item.node.userprofilesec?.classroomsec?.school;
    } else if ("userprofileprim" in item.node) {
      profileId = item.node.userprofileprim?.id?.toString();
      classId = item.node.userprofileprim?.classroomprim?.id?.toString();
      level = item.node.userprofileprim?.classroomprim?.level;
      campus = item.node.userprofileprim?.classroomprim?.school;
    }

    if (profileId) {
      const parsed = parseInt(decodeUrlID(profileId) || "0", 10);
      if (!isNaN(parsed)) storeProfileId(parsed);
    }

    if (classId) {
      const parsed = parseInt(decodeUrlID(classId) || "0", 10);
      if (!isNaN(parsed)) storeClassId(parsed);
    }

    if (campus) storeCampusInfo(campus);

    storeSection(section);
    storeLevel(level)

    router.replace({ pathname: `/(tabstudent)/${section}` });
  };

  useEffect(() => {
    if (selectedChild) refetch();

    if (
      !loadingSelectedProfiles &&
      dataProfilesSelectedChild &&
      (dataProfilesSelectedChild?.allSchoolFees?.edges.length ||
        dataProfilesSelectedChild?.allSchoolFeesSec?.edges.length ||
        dataProfilesSelectedChild?.allSchoolFeesPrim?.edges.length)
    ) {
      setShowProfile(true);
    }
  }, [selectedChild, loadingSelectedProfiles]);

  return (
    <View style={styles.container}>
      {/* ✅ Back button when viewing a child */}
      {showProfile && (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#FFF3E0", flexDirection: "row", alignItems: "center" }]}
          onPress={() => {
            setShowProfile(false);
            setSelectedChild(null);
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#E65100" style={{ marginRight: 8 }} />
          <Text style={{ color: "#E65100", fontWeight: "bold", fontSize: 16 }}>
            {t("Back")}
          </Text>
        </TouchableOpacity>
      )}


      <Text style={styles.header}>
        {role === "parent" && !showProfile
          ? t("academic.selectChild")
          : t("academic.selectYear")}
      </Text>

      {/* ✅ Selected Student Name */}
      <Text style={[styles.title, { color: COLORS.accent, textAlign: "center" }]}>
        {showProfile
          ? selectedChild?.preinscriptionStudent?.fullName
          : role === "student"
            ? dataProfiles?.allSchoolFees?.edges[0]?.node.userprofile?.customuser
              ?.preinscriptionStudent?.fullName ||
            dataProfiles?.allSchoolFeesSec?.edges[0]?.node.userprofilesec
              ?.customuser?.preinscriptionStudent?.fullName ||
            dataProfiles?.allSchoolFeesPrim?.edges[0]?.node.userprofileprim
              ?.customuser?.preinscriptionStudent?.fullName
            : null}
      </Text>

      {/* ✅ Parent child list */}
      {role === "parent" && !showProfile && dataChildren?.allCustomusers?.edges?.length ? (
        <FlatList<EdgeCustomUser>
          data={dataChildren?.allCustomusers?.edges ?? []}
          keyExtractor={(item) => item.node.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#EDE7F6" }]} // Lavender for child cards
              onPress={() => setSelectedChild(item.node)}
            >
              <Text style={[styles.title, { color: "#4527A0" }]}>
                <Ionicons name="school-outline" size={16} />{" "}
                {item.node.preinscriptionStudent?.fullName}
              </Text>
              <Text style={styles.text}>
                <Ionicons name="calendar-outline" size={16} /> {t("Matricle")}:{" "}
                {item.node.matricle}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      ) : null}


      {/* ✅ Fees Lists */}
      {(role === "student" &&
        (dataProfiles?.allSchoolFees?.edges?.length ||
          dataProfiles?.allSchoolFeesSec?.edges?.length ||
          dataProfiles?.allSchoolFeesPrim?.edges?.length)) ||
        (showProfile &&
          (dataProfilesSelectedChild?.allSchoolFees?.edges?.length ||
            dataProfilesSelectedChild?.allSchoolFeesSec?.edges?.length ||
            dataProfilesSelectedChild?.allSchoolFeesPrim?.edges?.length)) ? (
        <>
          {renderSchoolFeesList(
            (showProfile ? dataProfilesSelectedChild : dataProfiles)
              ?.allSchoolFees?.edges,
            "higher",
            handleSelect,
            t
          )}
          {renderSchoolFeesList(
            (showProfile ? dataProfilesSelectedChild : dataProfiles)
              ?.allSchoolFeesSec?.edges,
            "secondary",
            handleSelect,
            t
          )}
          {renderSchoolFeesList(
            (showProfile ? dataProfilesSelectedChild : dataProfiles)
              ?.allSchoolFeesPrim?.edges,
            "primary",
            handleSelect,
            t
          )}
        </>
      ) : null}
    </View>
  );
}

// ✅ Reusable Fees List
const renderSchoolFeesList = (
  data: any[] | undefined,
  section: "higher" | "secondary" | "primary",
  handleSelect: (item: any, section: "higher" | "secondary" | "primary") => void,
  t: any
) => {
  if (!data?.length) return null;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.node.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: sectionColors[section].bg }]}
          onPress={() => handleSelect(item, section)}
        >
          <Text style={[styles.title, { color: sectionColors[section].text }]}>
            <Ionicons name="school-outline" size={16} />{" "}
            {item.node.userprofile?.specialty?.mainSpecialty?.specialtyName ||
              item.node.userprofilesec?.classroomsec?.level ||
              item.node.userprofileprim?.classroomprim?.level}
          </Text>

          <Text style={styles.text}>
            <Ionicons name="calendar-outline" size={16} /> {t("academic.year")}:{" "}
            {item.node.userprofile?.specialty?.academicYear ||
              item.node.userprofilesec?.classroomsec?.academicYear ||
              item.node.userprofileprim?.classroomprim?.academicYear}
          </Text>

          <Text style={[styles.text, { fontWeight: 700 }]}>
            <Ionicons name="layers-outline" size={16} /> {t("academic.level")}:{" "}
            {item.node.userprofile?.specialty?.level?.level ||
              item.node.userprofilesec?.classroomsec?.classType ||
              item.node.userprofileprim?.classroomprim?.classType}
          </Text>

          <Text style={styles.text}>
            <MaterialCommunityIcons name="book-outline" size={16} />{" "}
            {t("academic.program")}:{" "}
            {item.node.userprofile?.program?.name ||
              item.node.userprofilesec?.classroomsec?.series?.name ||
              t("general.n/a")}
            {"  "}
            {item.node.platformPaid ? (
              <Text style={{ color: "green", fontWeight: "bold" }}>
                <Ionicons name="checkmark-circle" size={16} color="green" />{" "}
                {t("status.active")}
              </Text>
            ) : (
              <Text style={{ color: "red", fontWeight: "bold" }}>
                <Ionicons name="close-circle" size={16} color="red" />{" "}
                {t("status.inactive")}
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
});


const GET_CHILDREN = gql`
  query GetData(
    $parentTelephone: String!
  ) {
    allCustomusers(
      parentTelephone: $parentTelephone
    ) {
      edges {
        node {
          id matricle
          preinscriptionStudent {
            fullName
          }
        }
      }
    }
  }
`;

const GET_PROFILES = gql`
  query GetData($customuserId: Decimal!) {
    allSchoolFees(customuserId: $customuserId) {
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
              id matricle
              preinscriptionStudent {
                fullName
              }
            }
            specialty {
              id
              academicYear
              level {
                id level
              }
              mainSpecialty {
                specialtyName
              }
              school {
                id
                schoolName
                town
                address
                telephone
                country
                caLimit
                examLimit
                resitLimit
                seqLimit
              }
            }
          }
        }
      }
    }
    allSchoolFeesSec(customuserId: $customuserId) {
      edges {
        node {
          id
          platformPaid
          userprofilesec {
            id
            customuser {
              id matricle
              preinscriptionStudent {
                fullName
              }
            }
            classroomsec {
              id level academicYear classType
              series { name }
              school {
                id
                schoolName
                town
                address
                telephone
                country
                caLimit
                examLimit
                resitLimit
                seqLimit
              }
            }
          }
        }
      }
    }
    allSchoolFeesPrim(customuserId: $customuserId) {
      edges {
        node {
          id
          platformPaid
          userprofileprim {
            id
            customuser {
              id matricle
              preinscriptionStudent {
                fullName
              }
            }
            classroomprim {
              id level academicYear
              school {
                id
                schoolName
                town
                address
                telephone
                country
                caLimit
                examLimit
                resitLimit
                seqLimit
              }
            }
          }
        }
      }
    }
  }
`;