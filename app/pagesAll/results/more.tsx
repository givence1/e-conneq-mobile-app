import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TranscriptScreen() {
  
 
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppHeader showBack showTitle />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 80, // space for header
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Boxes */}
        <View style={styles.gridContainer}>
          {[
            
           {
            label: t("studentHome.transcript"),
            route: "/pagesAll/results/transcript",
            icon: <MaterialIcons
                    name="description"
                    size={24}
                    color={COLORS.primary}
                />,
            display: true,
        },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.box}
              onPress={() => router.push(item.route as any)}
            >
              {item.icon}
              <Text style={styles.boxLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  box: {
    width: "47%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  boxLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
});
