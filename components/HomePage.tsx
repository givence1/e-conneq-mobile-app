// ✅ components/HomePage.tsx
import AppHeader from '@/components/AppHeader';
import { MenuStudent } from '@/components/HomeMenu/MenuStudent';
import { MenuTeacher } from '@/components/HomeMenu/MenuTeacher';
import ProfileHeader from '@/components/ProfileHeader';
import UpdateModal from "@/components/UpdateModal";
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { gql, useQuery } from '@apollo/client';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CareerPathsCard from './CareerPathsCard';

interface HomePageProps {
  standalone?: boolean;
  showProfileHeader?: boolean;
}

const HomePage = ({ standalone = false, showProfileHeader = true }: HomePageProps) => {
  const { section, feesId, user, role } = useAuthStore();
  const router = useRouter();

  // --------------------------------------------------------------------------
  // 🔥 UPDATE MODAL STATE (INSIDE COMPONENT)
  // --------------------------------------------------------------------------
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [forceUpdate, setForceUpdate] = React.useState(false);
  const [updateInfo, setUpdateInfo] = React.useState({
    majorChanges: [] as string[],
    minorChanges: [] as string[],
    versionNumber: "1.1.4",
    rank: 10,
  });

  // --------------------------------------------------------------------------
  // 🔥 BACKEND VERSION QUERY
  // --------------------------------------------------------------------------
  const { data: versionData } = useQuery(GET_VERSION, {
    fetchPolicy: "network-only",
  });

  // --------------------------------------------------------------------------
  // 🔥 CHECK FOR APP UPDATES FROM BACKEND
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    async function checkForUpdates() {
      try {
        const remoteVersion =
          versionData?.allSchoolIdentifications?.edges?.[0]?.node?.version?.mobile;

        if (!remoteVersion) return;

        const remoteRank = remoteVersion.rank;
        const localRankStr = await AsyncStorage.getItem("@versionRank");
        const localRank = localRankStr ? parseInt(localRankStr) : 0;

        // ⭐ No update available → ranks match or local is higher
        if (remoteRank <= localRank) return;

        // ⭐ Save update info
        setUpdateInfo({
          majorChanges: remoteVersion.majorChanges || [],
          minorChanges: remoteVersion.minorChanges || [],
          versionNumber: remoteVersion.versionNumber,
          rank: remoteRank,
        });

        // ⭐ Force update if major changes exist
        const hasMajorChanges = remoteVersion.majorChanges?.length > 0;
        setForceUpdate(hasMajorChanges);

        // ⭐ Show the modal
        setShowUpdateModal(true);
      } catch (err) {
        console.log("Update version check error:", err);
      }
    }

    if (versionData) checkForUpdates();
  }, [versionData]);

  // --------------------------------------------------------------------------
  // 🧾 FEES AND PROFILE QUERIES
  // --------------------------------------------------------------------------
  const { data: dataFees, loading: loadingFees } = useQuery(GET_FEES, {
    variables: { id: feesId },
    skip: !feesId,
  });

  const { data: dataUser, loading: loadingUser } = useQuery(GET_LECTURER_USER, {
    variables: { id: user?.user_id },
    skip: !user?.user_id,
  });

  const profileData = {
    fees:
      section === 'higher'
        ? dataFees?.allSchoolFees?.edges[0]
        : section === 'secondary'
        ? dataFees?.allSchoolFeesSec?.edges[0]
        : section === 'primary'
        ? dataFees?.allSchoolFeesPrim?.edges[0]
        : dataFees?.allSchoolFees?.edges[0],
    user: dataUser?.allCustomusers?.edges[0]?.node,
  };

  const loading = loadingFees || loadingUser;

  // --------------------------------------------------------------------------
  // 🧩 PAGE CONTENT UI
  // --------------------------------------------------------------------------
  const content = (
    <>
      {/* 🔥 UPDATE MODAL */}
      {showUpdateModal && (
        <UpdateModal
          visible={true}
          force={forceUpdate}
          versionNumber={updateInfo.versionNumber}
          majorChanges={updateInfo.majorChanges}
          minorChanges={updateInfo.minorChanges}
          onClose={
            forceUpdate
              ? undefined
              : () => {
                  AsyncStorage.setItem("@versionRank", String(updateInfo.rank));
                  setShowUpdateModal(false);
                }
          }
        />
      )}

      <View style={localStyles.container}>
        {showProfileHeader && (
          <ProfileHeader
            fees={profileData.fees}
            user={profileData.user}
            loading={loading}
          />
        )}

        {(role === 'student' || role === 'parent') && (
          <CareerPathsCard rotateIntervalMs={10000} />
        )}

        {(role === 'student' || role === 'parent') && (
          <View style={localStyles.gridContainer}>
            {MenuStudent({ role, section })
              .filter((item) => item.display)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={localStyles.box}
                  onPress={() => router.push(item.route as any)}
                >
                  {item.icon}
                  <Text style={localStyles.boxLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {(role === 'admin' || role === 'teacher') && (
          <View style={localStyles.gridContainer}>
            {MenuTeacher({ role, section })
              .filter((item) => item.display)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={localStyles.box}
                  onPress={() => router.push(item.route as any)}
                >
                  {item.icon}
                  <Text style={localStyles.boxLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
    </>
  );

  // --------------------------------------------------------------------------
  // 🧱 STANDALONE LAYOUT
  // --------------------------------------------------------------------------
  if (standalone) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <AppHeader showTabs showTitle />

        <ScrollView
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </View>
    );
  }

  return content;
};

export default HomePage;

// --------------------------------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------------------------------
const localStyles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  box: {
    width: '47%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  boxLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
  },
});

// --------------------------------------------------------------------------
// 🧾 FEES + USER QUERIES
// --------------------------------------------------------------------------
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
  }
`;

const GET_LECTURER_USER = gql`
  query GetData($id: ID!) {
    allCustomusers(id: $id) {
      edges {
        node {
          id
          matricle
          preinscriptionLecturer {
            id
            fullName
          }
        }
      }
    }
  }
`;

// --------------------------------------------------------------------------
// 🔥 VERSION QUERY
// --------------------------------------------------------------------------
const GET_VERSION = gql`
  query GetVersion {
    allSchoolIdentifications {
      edges {
        node {
          version {
            mobile {
              versionNumber
              majorChanges
              minorChanges
              metadata
              rank
              updatedAt
            }
          }
        }
      }
    }
  }
`;
