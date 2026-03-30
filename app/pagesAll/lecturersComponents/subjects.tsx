import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../../components/AppHeader";
import COLORS from "../../../constants/colors";

export default function SubjectsScreen() {
  const subjects = [
    { id: "1", name: "Mathematics I", code: "MATH101" },
    { id: "2", name: "Electronics II", code: "ELEC202" },
  ];

  return (
    <View style={styles.container}>
     <AppHeader showBack  showTitle  />
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 }}
      >
        {subjects.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.cardTitle}>{s.name}</Text>
            <Text style={styles.cardSub}>{s.code}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  cardSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
});
