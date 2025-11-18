// app/domain/[id].tsx
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CAREER_DOMAINS, Specialty } from "../../components/data/careerPaths";
import SpecialtyModal from "../../components/SpecialtyModal";

export default function DomainDetailPage() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const domain = useMemo(() => CAREER_DOMAINS.find((d) => d.id === id), [id]);
  const [selected, setSelected] = useState<Specialty | null>(null);

  if (!domain) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Domain not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Stack.Screen options={{ title: domain.name }} />
      <View style={styles.header}>
        <Text style={styles.domainTitle}>{domain.icon} {domain.name}</Text>
        <Text style={styles.tagline}>{domain.tagline}</Text>
      </View>

      <FlatList
        data={domain.specialties}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSummary} numberOfLines={2}>{item.summary}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <SpecialtyModal specialty={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

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
