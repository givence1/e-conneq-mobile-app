import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { protocol, RootApi, tenant } from '@/utils/config';
import { EdgeSchoolFees, NodeCustomUser } from '@/utils/schemas/interfaceGraphql';
import { EdgeSchoolFeesPrim } from '@/utils/schemas/interfaceGraphqlPrimary';
import { EdgeSchoolFeesSec } from '@/utils/schemas/interfaceGraphqlSecondary';
import React from 'react';
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from 'react-native';

const ProfileHeader = (
  { fees, user }:
    { fees: EdgeSchoolFees | EdgeSchoolFeesSec | EdgeSchoolFeesPrim, user: NodeCustomUser }
) => {
  const { t } = useTranslation();
  const { role } = useAuthStore();

  // 🚨 Handle case: no fees
  if ((role === "student" || role === "parent") && !fees) {
    return (
      <View style={localStyles.noFeesContainer}>
        <Text style={localStyles.noFeesText}>{t("profile.noFees")}</Text>
      </View>
    );
  }

  // 🚨 Handle case: no lecturer / admin
  if ((role === "admin" || role === "teacher") && !user) {
    return (
      <View style={localStyles.noFeesContainer}>
        <Text style={localStyles.noFeesText}>{t("profileHeader.noProfileInfo")}</Text>
      </View>
    );
  }

  let profile: any;
  if (role === "admin" || role === "teacher") {
    profile = null
  } else if ("userprofile" in fees?.node) {
    profile = fees.node.userprofile;
  } else if ("userprofilesec" in fees.node) {
    profile = fees.node.userprofilesec;
  } else if ("userprofileprim" in fees.node) {
    profile = fees.node.userprofileprim;
  }


  const userPhoto =
    (role === "parent" || role === "student") && profile?.customuser?.photo && profile?.customuser?.photo?.length > 1
      ? { uri: `${protocol}${tenant}${RootApi}/media/${profile?.customuser?.photo}` } :
      (role === "admin" || role === "teacher") && user?.photo && profile?.customuser?.photo.length > 1
        ? { uri: `${protocol}${tenant}${RootApi}/media/${profile?.customuser?.photo}` } :
        {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile?.customuser?.preinscriptionLecturer?.fullName || profile?.customuser?.preinscriptionStudent?.fullName || profile?.customuser?.username || "User"
          )}&background=random&color=fff`,
        };

  return (
    <View style={localStyles.infoCard}>
      {/* Left side: Text info */}
      <View style={{ flex: 1 }}>
        <Text style={localStyles.name}>{ profile?.customuser?.preinscriptionLecturer?.fullName || profile?.customuser?.preinscriptionStudent?.fullName}</Text>

        {(role === "student" || role === "parent") ? <>
          <Text style={localStyles.program}>
            {profile?.specialty?.mainSpecialty?.specialtyName ||
              profile?.classroomsec?.level ||
              profile?.classroomprim?.level}
          </Text>
          <Text style={localStyles.level}>
            {profile?.specialty?.academicYear ||
              profile?.classroomsec?.academicYear ||
              profile?.classroomprim?.academicYear}{" "}
            |{" "}
            {profile?.specialty?.level?.level ||
              profile?.classroomsec?.level ||
              profile?.classroomprim?.level}
          </Text>
        </>
          :
          <Text style={{ fontWeight: 700, fontSize: 18, color: "white" }}>
            {role.toUpperCase()}
          </Text>
        }

        <Text style={localStyles.matricule}>
          {(role === "student" || role === "parent") ? t("profileHeader.matricule") : t("profile.username")}:{" "}
          <Text style={{ fontStyle: "italic" }}>
            {profile?.customuser?.matricle || user?.matricle || profile?.customuser?.username}
          </Text>
        </Text>

        {(role === "student" || role === "parent") ?
          <>
            <Text style={localStyles.performanceLabel}>
              {t("profileHeader.performance")}
            </Text>
            <View style={localStyles.progressBar}>
              <View style={[localStyles.progress, { width: "70%" }]} />
            </View>
          </> : null}


      </View>

      {/* Right side: Avatar */}
      <Image source={userPhoto} style={localStyles.avatar} />
    </View>
  );
};

export default ProfileHeader;

// Local Styles
const localStyles = StyleSheet.create({
  // 🔹 No fees alert card
  noFeesContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 14,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.warning,
    alignItems: "center",
    justifyContent: "center",
  },
  noFeesText: {
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  infoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  program: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  level: {
    color: COLORS.white,
    fontSize: 13,
    marginBottom: 2,
  },
  matricule: {
    color: COLORS.white,
    fontSize: 12,
    marginBottom: 10,
  },
  performanceLabel: {
    color: COLORS.white,
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    width: "90%",
  },
  progress: {
    height: 6,
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});