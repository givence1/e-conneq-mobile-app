// ✅ components/HomePage.tsx
import AppHeader from '@/components/AppHeader';
import { MenuStudent } from '@/components/HomeMenu/MenuStudent';
import { MenuTeacher } from '@/components/HomeMenu/MenuTeacher';
import ProfileHeader from '@/components/ProfileHeader';
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HomePageProps {
  standalone?: boolean; // full-page mode
  showProfileHeader?: boolean; // show or hide profile header
}

const HomePage = ({ standalone = false, showProfileHeader = true }: HomePageProps) => {
  const { section, feesId, user, role } = useAuthStore();
  const router = useRouter();

  // ✅ Fetch student/parent fees data
  const { data: dataFees, loading: loadingFees } = useQuery(GET_FEES, {
    variables: { id: feesId },
    skip: !feesId,
  });

  // ✅ Fetch lecturer or user info
  const { data: dataUser, loading: loadingUser } = useQuery(GET_LECTURER_USER, {
    variables: { id: user?.user_id },
    skip: !user?.user_id,
  });

  // ✅ Prepare props for ProfileHeader
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

  const content = (
    <View style={localStyles.container}>
      {/* ✅ Show Profile only if allowed */}
      {showProfileHeader && (
        <ProfileHeader fees={profileData.fees} user={profileData.user} loading={loading} />
      )}

      {/* ✅ Quick Actions for Students */}
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

      {/* ✅ Quick Actions for Teachers */}
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
  );

  if (standalone) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <AppHeader showTabs showTitle />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 20,
          }}
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
