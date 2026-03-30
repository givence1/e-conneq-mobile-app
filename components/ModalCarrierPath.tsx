// components/SpecialtyModal.tsx
import { NodeMainSpecialty } from "@/utils/schemas/interfaceGraphql";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


type Props = {
  specialty: NodeMainSpecialty | null;
  onClose: () => void;
};

const ModalCarrierPath = ({ specialty, onClose }: Props) => {
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 visible

  useEffect(() => {
    if (specialty) {
      Animated.timing(slideAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [specialty, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal visible={!!specialty} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.handle} />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.title}>{specialty?.specialtyName}</Text>
              {/* <Text style={styles.summary}>{specialty?.summary}</Text> */}

              <Text style={styles.sectionHeader}>Overview</Text>
              <Text style={styles.body}>{specialty?.description?.intro}</Text>
              <Text style={styles.body}>{specialty?.description?.overview}</Text>

              {specialty?.description?.requirements && specialty.description?.requirements.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>Requirements</Text>
                  {specialty?.description?.requirements.map((r, i) => (
                    <Text style={styles.body} key={i}>• {r}</Text>
                  ))}
                </>
              )}

              {specialty?.description?.recommendedCourses && (
                <>
                  <Text style={styles.sectionHeader}>Recommended Courses</Text>
                  {specialty?.description?.recommendedCourses.map((c) => (
                    <Text style={styles.body} key={c}>• {c}</Text>
                  ))}
                </>
              )}

              {specialty?.description?.salary && (
                <>
                  <Text style={styles.sectionHeader}>Salary</Text>
                  <Text style={styles.body}>{specialty?.description?.salary}</Text>
                </>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default ModalCarrierPath

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "86%",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 8,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  summary: { fontSize: 14, color: "#374151", marginTop: 6 },
  sectionHeader: { marginTop: 12, fontSize: 14, fontWeight: "700", color: "#0F172A" },
  body: { fontSize: 14, color: "#374151", marginTop: 6, lineHeight: 20 },
  footer: { padding: 12, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  closeBtn: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700" },
});