import AppHeader from '@/components/AppHeader';
import MyTab from '@/components/MyTab';
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { capitalizeEachWord, getISOWeek, getWeekRange } from '@/utils/functions';
import { JwtPayload } from '@/utils/interfaces';
import { EdgeTimeTable } from '@/utils/schemas/interfaceGraphql';
import { gql, useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import DisplayGeneral from './DisplayGeneral';
import DisplaySingle from './DisplaySingle';

const Index = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const user: JwtPayload | null = token ? jwtDecode(token) : null;
  const [tab, setTab] = useState("my courses");

  const { data, loading, refetch } = useQuery(GET_DATA, {
    variables: {
      domainIds: (user as any)?.domain,
      assignedToId: user?.user_id,
      monthGte: new Date().getMonth(),
    },
    skip: !user,
  });

  const weekNo = getISOWeek(new Date());
  const weekRangeLastWeek = getWeekRange(weekNo - 1, new Date().getFullYear());
  const weekRangeCurrentWeek = getWeekRange(weekNo, new Date().getFullYear());
  const combinedLastCurrentWeeks = [...weekRangeLastWeek, ...weekRangeCurrentWeek];

  const filteredDataByWeeks = filteredEdgeTT(data?.allTimeTables?.edges, combinedLastCurrentWeeks);
  const filteredSlots = getUserSlots(filteredDataByWeeks, user?.user_id || 0);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTitle />

      <View style={styles.scrollContent}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
            color: "#0066cc",
            marginVertical: 8,
          }}
        >
          {capitalizeEachWord(t("my timetable"))}
        </Text>

        {loading ? (
          <View>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <MyTab value={tab} tabs={["my courses", "general"]} onChange={setTab} />
            {tab !== "general" ? (
              <DisplaySingle data={filteredSlots} />
            ) : (
              <DisplayGeneral data={filteredDataByWeeks} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 90,
  },
});

const GET_DATA = gql`
  query GetData($domainIds: [Int]!, $assignedToId: Decimal!, $monthGte: Decimal!) {
    allTimeTables(domainIds: $domainIds, assignedToId: $assignedToId, monthGte: $monthGte) {
      edges {
        node {
          id
          monthName
          year
          specialty {
            academicYear
            level {
              level
            }
            mainSpecialty {
              specialtyName
            }
            school {
              campus
            }
          }
          period {
            date
            slots {
              assignedToId
              courseName
              hallName
              start
              status
              end
            }
          }
        }
      }
    }
  }
`;

const filteredEdgeTT = (data: EdgeTimeTable[], weekDates: string[]) => {
  if (!data) return [];

  return data
    .map((tt) => {
      const filteredPeriods = tt.node.period.filter((period) =>
        weekDates.includes(period.date)
      );

      if (filteredPeriods.length > 0) {
        return {
          ...tt,
          node: {
            ...tt.node,
            period: filteredPeriods,
          },
        };
      }
      return null;
    })
    .filter(Boolean) as EdgeTimeTable[];
};

const getUserSlots = (data: any, userId: number) => {
  if (!data) return [];

  const allSlots = data.flatMap(({ node }: any) =>
    node.period.flatMap((p: any) =>
      p.slots
        .filter((slot: any) => slot.assignedToId === userId)
        .map((slot: any) => ({
          ...slot,
          date: p.date,
          monthName: node.monthName,
          year: node.year,
        }))
    )
  );

  return allSlots;
};
