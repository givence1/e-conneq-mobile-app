import AppHeader from '@/components/AppHeader';
import COLORS from '@/constants/colors';
import { EdgeResult } from '@/utils/schemas/interfaceGraphql';
import { gql, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@/utils/interfaces';
import { useAuthStore } from '@/store/authStore';
import { capitalizeEachWord } from '@/utils/functions';

const Index = () => {
    const { t } = useTranslation();
    const { token } = useAuthStore();
    const user: JwtPayload | null = token ? jwtDecode(token) : null;
    const route = useRoute();
    const params: any = route.params || {};

    const { data, loading: loading, refetch } = useQuery(GET_DATA, {
        variables: { id: parseInt(params.courseId), courseId: params?.courseId },
    });


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppHeader showBack showTitle />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text>{capitalizeEachWord(t("my timetable"))}</Text>

                {
                    loading ?
                        <View>
                            <ActivityIndicator />
                        </View>

                        :

                        <View>
                            <Text>Data</Text>
                        </View>
                }



            </ScrollView>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 90, // space for TabsHeader
    },
});

const GET_DATA = gql`
query GetData(
    $id: ID!,
) {
    allTimeTables(
        id: $id
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;