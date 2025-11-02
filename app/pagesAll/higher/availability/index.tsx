import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { capitalizeEachWord, getISOWeek, getWeekRange } from '@/utils/functions';
import { JwtPayload } from '@/utils/interfaces';
import { EdgeLecturerAvailability } from '@/utils/schemas/interfaceGraphql';
import { gql, useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import CreateEditAvailability from './CreateEditAvailability';
import Display from './Display';
import ViewAvailability from './ViewAvailability';

const Index = () => {
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const user: JwtPayload | null = token ? jwtDecode(token) : null;

  const [selected, setSelected] = useState<{
    weekRange: string[] | null;
    display: 'create' | 'view' | 'edit' | null;
    selected: any;
  }>({
    weekRange: null,
    display: null,
    selected: null,
  });

  const { data, loading, refetch } = useQuery(GET_DATA, {
    variables: {
      customuserId: user?.user_id,
      monthGte: new Date().getMonth(),
    },
    skip: !user,
  });

  // Generate week ranges
  const weekNo = getISOWeek(new Date());
  const weekRangeLastWeek = getWeekRange(weekNo - 1, new Date().getFullYear());
  const weekRangeCurrentWeek = getWeekRange(weekNo, new Date().getFullYear());
  const weekRangeNextWeek = getWeekRange(weekNo + 1, new Date().getFullYear());
  const weekRangeNextTwoWeek = getWeekRange(weekNo + 2, new Date().getFullYear());
  const combinedWeek = [
    ...weekRangeLastWeek,
    ...weekRangeCurrentWeek,
    ...weekRangeNextWeek,
    ...weekRangeNextTwoWeek,
  ];

  const edges = data?.allLecturerAvailability?.edges;

  // Filter and prepare data
  const filteredDataByWeeksAll = useMemo(() => filteredEdgeTT(edges, combinedWeek), [edges]);
  const filteredDataByWeeks = useMemo(() => filteredEdgeTT(edges, selected?.weekRange), [edges, selected?.weekRange]);
  const filteredNodeAvailability = useMemo(
    () => getNodeAvailability(filteredDataByWeeks, selected?.weekRange),
    [filteredDataByWeeks, selected?.weekRange]
  );
  const filteredSlots = useMemo(() => getUserSlots(filteredDataByWeeks), [filteredDataByWeeks]);

  // Render main content depending on selected.display
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />;
    }

    if (selected?.display === 'create' || (selected?.display === 'edit' && selected?.weekRange?.length)) {
      return (
        <CreateEditAvailability
          data={filteredNodeAvailability}
          dataAllWeeks={filteredDataByWeeksAll?.length ? filteredDataByWeeksAll[0]?.node : null}
          weeks={selected?.weekRange}
          refetch={refetch}
          setSelected={setSelected}
        />
      );
    }

    if (selected?.display === 'view' && selected?.weekRange?.length) {
      return <ViewAvailability data={filteredSlots} selected={selected} setSelected={setSelected} />;
    }

    return <Display data={[weekRangeLastWeek, weekRangeCurrentWeek, weekRangeNextWeek, weekRangeNextTwoWeek]} setSelected={setSelected} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTitle />
       
         
            <Text style={styles.title}>{capitalizeEachWord(t('ui.availability'))}</Text>
       
       
      <FlatList
        data={[1]} // dummy single-item to allow FlatList scrolling
        keyExtractor={() => 'main-content'}
        renderItem={renderContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;

/* ------------------- GraphQL ------------------- */
const GET_DATA = gql`
  query GetData($customuserId: Decimal!, $monthGte: Decimal!) {
    allLecturerAvailability(customuserId: $customuserId, monthGte: $monthGte) {
      edges {
        node {
          id
          year
          month
          monthName
          availabilitySlots {
            date
            slots {
              start
              end
            }
          }
          customuser {
            preinscriptionLecturer {
              fullName
            }
          }
          createdBy { id }
        }
      }
    }
  }
`;

/* ------------------- Utility Functions ------------------- */
const getNodeAvailability = (
  data: EdgeLecturerAvailability[],
  weekDates?: string[] | null
): typeof data[0]['node'] | null => {
  if (!data || !weekDates) return null;
  for (const tt of data) {
    if (tt.node?.availabilitySlots?.some(slot => weekDates.includes(slot.date))) return tt.node || null;
  }
  return null;
};

const filteredEdgeTT = (data: EdgeLecturerAvailability[], weekDates?: string[] | null): EdgeLecturerAvailability[] => {
  if (!data || !weekDates) return [];
  return data
    .map(tt => {
      const filteredSlots = tt.node.availabilitySlots.filter(slot => weekDates.includes(slot.date));
      if (filteredSlots.length === 0) return null;
      return {
        ...tt,
        node: {
          ...tt.node,
          availabilitySlots: filteredSlots.map(slot => ({ ...slot, slots: slot.slots.map(s => ({ ...s })) })),
        },
      };
    })
    .filter(Boolean) as EdgeLecturerAvailability[];
};

const getUserSlots = (data: EdgeLecturerAvailability[]) => {
  if (!data) return [];
  return data.flatMap(item =>
    item.node.availabilitySlots.flatMap(slot =>
      slot.slots.map(s => ({
        ...s,
        date: slot.date,
        monthName: item.node.monthName,
        year: item.node.year,
      }))
    )
  );
};

/* ------------------- Styles ------------------- */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 50,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  title: {
    paddingTop: 60,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0066cc',
    marginVertical: 8,
  },
});
