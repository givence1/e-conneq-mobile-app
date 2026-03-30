import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Question = {
  id: string;
  course: string;
  type: "CA" | "Exam" | "Resit";
  status: "Pending" | "Approved" | "Rejected";
  fileName: string;
};

export default function LecturerQuestionsScreen() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      course: "Computer Networks",
      type: "CA",
      status: "Approved",
      fileName: "networks_ca.pdf",
    },
    {
      id: "2",
      course: "Operating Systems",
      type: "Exam",
      status: "Pending",
      fileName: "os_exam.pdf",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<"CA" | "Exam" | "Resit">("CA");

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newQuestion: Question = {
          id: Date.now().toString(),
          course: "Computer Networks", // 👉 later bind with actual course
          type: selectedType,
          status: "Pending",
          fileName: file.name || "Uploaded File",
        };
        setQuestions((prev) => [newQuestion, ...prev]);

       
      }
    } catch (err) {
      console.error("File upload error:", err);
     
    } finally {
      setModalVisible(false);
    }
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <View style={styles.card}>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.meta}>Type: {item.type}</Text>
      <Text
        style={[
          styles.status,
          item.status === "Approved"
            ? { color: "green" }
            : item.status === "Rejected"
            ? { color: "red" }
            : { color: "orange" },
        ]}
      >
        Status: {item.status}
      </Text>
      <Text style={styles.fileName}>{item.fileName}</Text>
    </View>
  );

  return (
    
    <View style={styles.container}>
      <AppHeader showBack showTabs  showTitle  />
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      />

      {/* Floating + Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upload Question</Text>

            {/* Dropdown Picker */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(val) => setSelectedType(val)}
                style={styles.picker}
              >
                <Picker.Item label="CA" value="CA" />
                <Picker.Item label="Exam" value="Exam" />
                <Picker.Item label="Resit" value="Resit" />
              </Picker>
            </View>

            {/* Upload Button */}
            <TouchableOpacity style={styles.modalBtn} onPress={handleUpload}>
              <Text style={styles.modalBtnText}>Upload Question</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: COLORS.border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.textPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  course: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  fileName: {
    fontSize: 12,
    marginTop: 6,
    color: COLORS.textSecondary,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: COLORS.textPrimary,
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  modalBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    marginBottom: 12,
  },
  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
