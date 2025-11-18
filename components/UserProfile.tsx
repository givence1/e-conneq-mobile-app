import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { protocol, RootApi, tenant } from "@/utils/config"; // ✅ import same as lecturer
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


const UserProfile = () => {
  const { t } = useTranslation();
  const { logout, user, feesId, role } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      t("profile.logoutTitle"),
      t("profile.logoutMessage"),
      [
        { text: t("profile.cancel"), style: "cancel" },
        { text: t("profile.yes"), style: "destructive", onPress: () => logout() },
      ]
    );
    // logout();
  };


  const { data, loading, error } = useQuery(GET_FEES_USER, {
    variables: {
      feesId: feesId,
    },
    skip: !feesId,
  });
  const { data: dataLect } = useQuery(GET_USER, {
    variables: {
      userId: user?.user_id,
    },
    skip: !user,
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>{t("ui.loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red" }}>{t("profile.loadError")}</Text>
      </View>
    );
  }

  const fees = data?.allSchoolFees?.edges?.[0]?.node || data?.allSchoolFeesSec?.edges?.[0]?.node || data?.allSchoolFeesPrim?.edges?.[0]?.node || {};
  const userLect = dataLect?.allCustomusers?.edges[0]?.node
  const profile = fees?.userprofile || fees?.userprofilesec || fees?.userprofileprim
  const userPhoto = (fees?.userprofile?.customuser?.photo?.length > 1 || userLect?.photo?.length > 1)
    ? { uri: `${protocol}${tenant}${RootApi}/media/${profile?.customuser?.photo || userLect?.photo}` }
    : require("@/assets/images/icon.png");

    return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <Image source={userPhoto} style={styles.avatar} />
          <Text style={styles.name}>{profile?.customuser?.preinscriptionStudent?.fullName || userLect?.preinscriptionLecturer?.fullName || t("ui.noData")}</Text>
          <Text style={styles.matric}>
            {t("profile.username")}: {profile?.customuser?.matricle || profile?.customuser?.userName || user?.matricle || "N/A"}
          </Text>
        </View>


        {/* Personal Info */}
        {role === "student" || role === "parent" ? <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>ℹ️ {t("profile.personalInfo")}</Text>
          <InfoRow label={t("profile.email")} value={profile?.customuser?.preinscriptionStudent?.email || userLect?.preinscriptionLecturer?.email} />
          <InfoRow label={t("profile.phone")} value={profile?.customuser?.preinscriptionStudent?.telephone || userLect?.preinscriptionLecturer?.telephone} />
          <InfoRow label={t("profile.dob")} value={profile?.customuser?.preinscriptionStudent?.dob || userLect?.preinscriptionLecturer?.dob} />
          <InfoRow label={t("profile.pob")} value={profile?.customuser?.preinscriptionStudent?.pob || userLect?.preinscriptionLecturer?.pob} />
        </View>
        :
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>ℹ️ {t("profile.personalInfo")}</Text>
          <InfoRow label={t("profile.email")} value={profile?.customuser?.preinscriptionLecturer?.email || userLect?.preinscriptionLecturer?.email} />
          <InfoRow label={t("profile.phone")} value={profile?.customuser?.preinscriptionLecturer?.telephone || userLect?.preinscriptionLecturer?.telephone} />
          <InfoRow label={t("profile.dob")} value={profile?.customuser?.preinscriptionLecturer?.dob || userLect?.preinscriptionLecturer?.dob} />
          <InfoRow label={t("profile.pob")} value={profile?.customuser?.preinscriptionLecturer?.pob || userLect?.preinscriptionLecturer?.pob} />
        </View>}



        {/* Parent Info */}
        {role === "student" ? <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 {t("profile.parentInfo")}</Text>
          <InfoRow label={t("profile.fatherName")} value={profile?.customuser?.preinscriptionStudent?.fatherName} />
          <InfoRow label={t("profile.fatherPhone")} value={profile?.customuser?.preinscriptionStudent?.fatherTelephone} />
          <InfoRow label={t("profile.motherName")} value={profile?.customuser?.preinscriptionStudent?.motherName} />
          <InfoRow label={t("profile.motherPhone")} value={profile?.customuser?.preinscriptionStudent?.motherTelephone} />
          <InfoRow label={t("profile.parentAddress")} value={profile?.customuser?.preinscriptionStudent?.parentAddress} />
        </View> : null}

        {/* Academic Info */}
        {role === "student" ? <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>🎓 {t("profile.academicInfo")}</Text>
          <InfoRow label={t("profile.program")} value={profile?.program?.name || profile?.programsec || profile?.programprim} />
          <InfoRow label={t("profile.level")} value={profile?.specialty?.level?.level || profile?.classroomsec?.level || profile?.classroomprim?.level} />
          {profile?.specialty ? <InfoRow label={t("profile.department")} value={profile?.specialty?.mainSpecialty?.specialtyName} /> : null}
          {profile?.classroomsec?.series?.name ? <InfoRow label={t("profile.series")} value={profile?.classroomsec?.series?.name} /> : null}
          {profile?.classroomsec?.classType ? <InfoRow label={t("profile.classtype")} value={profile?.classroomsec?.classType} /> : null}
          <InfoRow label={t("profile.yearObtained")} value={profile?.specialty?.academicYear || profile?.classroomsec?.academicYear || profile?.classroomprim?.academicYear} />
        </View> : null}


        {role === "admin" || role === "teacher" ? <View style={styles.infoCard}>
         <Text style={styles.sectionTitle}>🎓 {t("profile.academicInfo")}</Text>
          <InfoRow label={t("profile.highestCertificate")} value={profile?.customuser?.preinscriptionLecturer?.highestCertificate} />
          <InfoRow label={t("profile.yearObtained")} value={profile?.customuser?.preinscriptionLecturer?.yearObtained} />
        </View> : null}


        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default UserProfile

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue} numberOfLines={3} ellipsizeMode="tail">
      {value || "N/A"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    marginTop: -20,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",   
    marginBottom: 4,
  },
  matric: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",  
    flexWrap: "wrap",
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    flexWrap: "wrap",  
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flexShrink: 1,
    maxWidth: "40%",   
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
    flexShrink: 1,
    maxWidth: "60%",   
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: 20,
    padding: 14,
    borderRadius: 30,
  },
  logoutText: {
    marginLeft: 8,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});


const GET_FEES_USER = gql`
  query GetData (
    $feesId: ID!
  ) {
    allSchoolFees(
        id: $feesId
    ) {
        edges {
            node {
                id
                userprofile {
                    program { name }
                    specialty {
                        academicYear
                        level { level }
                        mainSpecialty { specialtyName }
                    }
                    customuser {
                        photo matricle
                        preinscriptionStudent {
                            fullName email telephone dob pob
                            fatherName fatherTelephone motherName motherTelephone parentAddress
                        }
                    }
                }
            }
        }
    }
    allSchoolFeesSec (
        id: $feesId
    ) {
        edges {
            node {
                id
                userprofilesec {
                    programsec
                    classroomsec {
                        academicYear
                        level classType
                    }
                    customuser {
                        photo matricle
                        preinscriptionStudent {
                            fullName email telephone dob pob
                            fatherName fatherTelephone motherName motherTelephone parentAddress
                        }
                    }
                }
            }
        }
    }
    allSchoolFeesPrim (
        id: $feesId
    ) {
        edges {
            node {
                id
                userprofileprim {
                    programprim
                    classroomprim {
                        academicYear
                        level
                    }
                    customuser {
                        photo matricle
                        preinscriptionStudent {
                            fullName email telephone dob pob
                            fatherName fatherTelephone motherName motherTelephone parentAddress
                        }
                    }
                }
            }
        }
    }
  }
`;


const GET_USER = gql`
  query GetData (
    $userId: ID!
  ) {
    allCustomusers (
        id: $userId
    ) {
        edges {
            node {
                id
                photo matricle
                preinscriptionLecturer {
                    fullName email telephone dob pob
                    fatherName fatherTelephone parentAddress
                }
            }
        }
    }
  }
`;