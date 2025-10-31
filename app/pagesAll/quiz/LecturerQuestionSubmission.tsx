import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type QuestionItem = {
  id: string;
  academicYear: string;
  type: string;
  semester: string;
  course: string;
  fileName: string;
  status: "Pending" | "Approved" | "Rejected";
};

export default function LecturerQuestionSubmission() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [academicYear, setAcademicYear] = useState("");
  const [type, setType] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.canceled) return;

    const file = result.assets[0];
    if (file.mimeType !== "application/pdf") {
      Alert.alert("Invalid file", "Please upload a PDF file only.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!academicYear || !type || !semester || !course || !selectedFile) {
      Alert.alert("Missing Fields", "Please fill all fields and upload a PDF file.");
      return;
    }

    const newQuestion: QuestionItem = {
      id: Math.random().toString(),
      academicYear,
      type,
      semester,
      course,
      fileName: selectedFile.name,
      status: "Pending",
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setModalVisible(false);
    // Reset form
    setAcademicYear("");
    setType("");
    setSemester("");
    setCourse("");
    setSelectedFile(null);
  };

  const handleChangeFile = async (id: string) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.canceled) return;

    const file = result.assets[0];
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, fileName: file.name, status: "Pending" } : q
      )
    );
  };

  const renderQuestionCard = ({ item }: { item: QuestionItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
        <Text style={styles.cardTitle}>{item.course}</Text>
      </View>
      <Text style={styles.cardText}>Academic Year: {item.academicYear}</Text>
      <Text style={styles.cardText}>Type: {item.type}</Text>
      <Text style={styles.cardText}>Semester: {item.semester}</Text>
      <Text style={styles.cardText}>File: {item.fileName}</Text>

      <Text
        style={[
          styles.status,
          {
            color:
              item.status === "Approved"
                ? "green"
                : item.status === "Rejected"
                ? "red"
                : "orange",
          },
        ]}
      >
        Status: {item.status}
      </Text>

      <TouchableOpacity
        style={styles.changeButton}
        onPress={() => handleChangeFile(item.id)}
      >
        <Text style={styles.changeButtonText}>Change Document</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTitle />

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestionCard}
        contentContainerStyle={{ padding: 16, paddingTop: 80, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: COLORS.textSecondary }}>
            No questions submitted yet.
          </Text>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Course Material</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
             

              {/* Question Type */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Material Type</Text>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Type" value="" />
                  <Picker.Item label="CA" value="CA" />
                  <Picker.Item label="Exam" value="Exam" />
                  <Picker.Item label="Resit" value="Resit" />
                  <Picker.Item label="Course outline" value="courseoutline" />
                </Picker>
              </View>

              {/* Semester
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Semester</Text>
                <Picker
                  selectedValue={semester}
                  onValueChange={setSemester}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Semester" value="" />
                  <Picker.Item label="I" value="I" />
                  <Picker.Item label="II" value="II" />
                </Picker>
              </View> */}

              {/* Course */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Course</Text>
                <Picker
                  selectedValue={course}
                  onValueChange={setCourse}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Course" value="" />
                  <Picker.Item label="Mathematics 101" value="Mathematics 101" />
                  <Picker.Item label="Physics 102" value="Physics 102" />
                  <Picker.Item label="Computer Science 103" value="Computer Science 103" />
                </Picker>
              </View>

              {/* Upload */}
              <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                <Text style={styles.uploadText}>
                  {selectedFile ? selectedFile.name : "Upload PDF"}
                </Text>
              </TouchableOpacity>

              {/* Submit */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.textPrimary,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  status: {
    marginTop: 6,
    fontWeight: "700",
  },
  changeButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  changeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
  },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: "center",
  },
});