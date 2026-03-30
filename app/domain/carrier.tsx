import AppHeader from "@/components/AppHeader";
import ModalCarrierPath from "@/components/ModalCarrierPath";
import { capitalizeEachWord } from "@/utils/functions";
import { EdgeDomain, NodeMainSpecialty } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const CarrierPath = () => {

    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const id = params.id as string;

    const { data, loading, error } = useQuery<{ allDomains: { edges: EdgeDomain[] } }>(
        GET_DOMAINS, {
        variables: { id: id },
        skip: !id
    });

    const domain = useMemo(() => data?.allDomains?.edges[0], [data]);
    const [selected, setSelected] = useState<NodeMainSpecialty | null>(null);
    console.log(loading);

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>{capitalizeEachWord(t("an error occured"))}</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!domain) {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>{capitalizeEachWord(t("no domain found"))}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <AppHeader showBack showTabs showTitle />

            <View style={{ padding: 16 }}>


                <Stack.Screen options={{ title: domain?.node?.domainName }} />
                <View style={[styles.header, { marginTop: 90 }]}>
                    <Text style={styles.domainTitle}>
                        {/* {domain.icon} */}
                        {domain?.node?.domainName}</Text>
                    {/* <Text style={styles.tagline}>{domain.tagline}</Text> */}
                </View>

                <FlatList
                    data={domain?.node?.mainSpecialties}
                    keyExtractor={(s) => s.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
                            <Text style={styles.cardTitle}>{item?.specialtyName}</Text>
                            <Text style={styles.cardSummary} numberOfLines={2}>{item?.description?.overview}</Text>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                />

                <ModalCarrierPath
                    specialty={selected}
                    onClose={() => setSelected(null)}
                />
            </View>
        </View>
    );
}

export default CarrierPath


const GET_DOMAINS = gql`
  query GetData(
    $id: ID!
  ) {
    allDomains (
      id: $id
    ) {
      edges {
        node {
          id domainName
          mainSpecialties {
            description {
              intro
              overview
              recommendedCourses
              requirements
              salary
            }
            specialtyName
          }
        }
      }
    }
  }
`;



const styles = StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    header: { marginBottom: 12 },
    domainTitle: { fontSize: 22, fontWeight: "800" },
    tagline: { fontSize: 13, color: "#374151", marginTop: 6 },
    card: {
        backgroundColor: "#FAFAFA",
        padding: 14,
        borderRadius: 10,
        borderColor: "#E5E7EB",
        borderWidth: 1,
    },
    cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    cardSummary: { fontSize: 13, color: "#6B7280", marginTop: 6 },
    title: { fontSize: 18, fontWeight: "700" },
});