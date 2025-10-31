import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useMutation } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// ---------- GraphQL ----------
const SUBMIT_AVAILABILITY = gql`
  mutation SubmitAvailability($lecturerName: String!, $availability: [String!]!) {
    createLecturerAvailability(lecturerName: $lecturerName, weekDays: $availability) {
      id
      lecturerName
      weekDays
      createdAt
    }
  }
`;

const LecturerAvailability = () => {
  const { user } = useAuthStore();
  const lecturerName = user?.username || "Unknown Lecturer";

  // Example week data (you can replace with dynamic date logic if needed)
  const weekData = [
    { day: "Monday", date: "2025-10-20" },
    { day: "Tuesday", date: "2025-10-21" },
    { day: "Wednesday", date: "2025-10-22" },
    { day: "Thursday", date: "2025-10-23" },
    { day: "Friday", date: "2025-10-24" },
    { day: "Sartuday", date: "2025-10-25" },
    { day: "Sunday", date: "2025-10-26" },
  ];

  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "13:00 - 15:00",
    "15:00 - 17:00",
    "17:00 - 19:00",
    "19:00 - 21:00",
  ];

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [submitAvailability, { loading }] = useMutation(SUBMIT_AVAILABILITY);

  const toggleSlot = (day: string, slot: string) => {
    const key = `${day}-${slot}`;
    setSelectedSlots((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      Alert.alert("Error", "Please select at least one available period.");
      return;
    }

    try {
      const res = await submitAvailability({
        variables: {
          lecturerName,
          availability: selectedSlots,
        },
      });

      if (res?.data?.createLecturerAvailability?.id) {
        Toast.show({
          type: "success",
          text1: "Availability Submitted!",
          text2: "Your available periods were successfully recorded.",
        });
        setSelectedSlots([]);
      }
    } catch (error) {
      console.error("❌ Error submitting availability:", error);
      Alert.alert("Error", "Unable to submit availability. Try again later.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <AppHeader showBack showTitle />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SELECT YOUR AVAILABLE PERIOD</Text>

        {weekData.map((dayObj) => (
          <View key={dayObj.day} style={styles.daySection}>
            <Text style={styles.dayLabel}>
              {dayObj.day} ({dayObj.date})
            </Text>

            <View style={styles.slotRow}>
              {timeSlots.map((slot) => {
                const key = `${dayObj.day}-${slot}`;
                const selected = selectedSlots.includes(key);
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotButton,
                      selected && styles.slotButtonSelected,
                    ]}
                    onPress={() => toggleSlot(dayObj.day, slot)}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selected && styles.slotTextSelected,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primary]}
            style={styles.gradientBtn}
          >
            <Text style={styles.buttonText}>
              {loading ? "Submitting..." : "Submit Availability"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </View>
  );
};

export default LecturerAvailability;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 16,
  },
  daySection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slotButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    width: "32%",
    marginBottom: 8,
    alignItems: "center",
  },
  slotButtonSelected: {
    backgroundColor: "#3CB371",
    borderColor: "#3CB371",
  },
  slotText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  slotTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  submitBtn: {
    marginTop: 20,
    marginBottom: 30,
  },
  gradientBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
