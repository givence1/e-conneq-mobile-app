import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/utils/interfaces';
import { useAuthStore } from '@/store/authStore';
import { capitalizeEachWord, getISOWeek, getWeekRange } from '@/utils/functions';
import DisplaySingle from './DisplaySingle';
import { EdgeLecturerAvailability } from '@/utils/schemas/interfaceGraphql';


const Index = () => {
    const { t } = useTranslation();
    const { token } = useAuthStore();
    const user: JwtPayload | null = token ? jwtDecode(token) : null;

    const { data, loading: loading, refetch } = useQuery(GET_DATA, {
        variables: {
            customuserId: user?.user_id,
            monthGte: new Date().getMonth(),
        },
        skip: !user
    });

    const weekNo = getISOWeek(new Date())
    const weekRangeLastWeek = getWeekRange(weekNo - 1, new Date().getFullYear())
    const weekRangeCurrentWeek = getWeekRange(weekNo, new Date().getFullYear())
    const combinedLastCurrentWeeks = [...weekRangeLastWeek, ...weekRangeCurrentWeek]

    const filteredDataByWeeks = filteredEdgeTT(data?.allLecturerAvailability?.edges, combinedLastCurrentWeeks)
    const filteredSlots = getUserSlots(filteredDataByWeeks)


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>

            <AppHeader showBack showTitle />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        textAlign: "center",
                        color: "#0066cc",
                        marginVertical: 8,
                    }}
                >
                    {capitalizeEachWord(t("my availabilty"))}
                </Text>

                {
                    loading ?
                        <View>
                            <ActivityIndicator />
                        </View>

                        :

                        <View>
                            <DisplaySingle data={filteredSlots} />
                        </View>
                }


            </ScrollView>
        </View>
    );
};

export default Index;


const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 90, // space for TabsHeader
    },
});


const GET_DATA = gql`
query GetData(
    $customuserId: Decimal!,
    $monthGte: Decimal!,
) {
    allLecturerAvailability (
        customuserId: $customuserId
        monthGte: $monthGte
    ) {
        edges {
            node {
                id
                availabilitySlots {
                date
                slots {
                    end
                    start
                }
                }
                monthName
                year
            }
        }
    }
}`;

const filteredEdgeTT = (data: EdgeLecturerAvailability[], weekDates: string[]) => {
  if (!data) return [];

  return data
    .map(tt => {
      const filteredSlots = tt.node?.availabilitySlots?.filter(slot =>
        weekDates.includes(slot.date)
      );

      if (filteredSlots.length > 0) {
        return {
          ...tt,
          node: {
            ...tt.node,
            availabilitySlots: filteredSlots
          }
        };
      }
      return null; // no periods in this week
    })
    .filter(Boolean) as EdgeLecturerAvailability[]; // remove nulls
};


const getUserSlots = (data: EdgeLecturerAvailability[]) => {
    if (!data) return [];

    const allSlots = data.flatMap(item =>
        item.node.availabilitySlots.flatMap((p: any) =>
            p.slots
                .map((slot: any) => ({
                    ...slot,
                    date: p.date,
                    monthName: item.node.monthName,
                    year: item.node.year,
                }))
        )
    );

    return allSlots;
}
