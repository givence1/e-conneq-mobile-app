import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { decodeUrlID, getAcademicYear } from "@/utils/functions";
import { EdgeCourse, EdgePublish, NodeCourse } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // ✅ translation hook
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PortalStatus = {
  ca: boolean;
  exam: boolean;
  resit: boolean;
};

type ClassItem = {
  id: string;
  specialty: string;
  level: string;
  course: string;
  semester: number;
  portal: PortalStatus;
};

export default function LecturerPortalScreen() {
  const { user } = useAuthStore();
  const { t } = useTranslation(); // ✅ translation instance

  const [year, setYear] = useState(getAcademicYear());
  const [myPortals, setMyPortals] = useState<EdgePublish[]>();
  const [portalTypes, setPortalTypes] = useState<string[]>();

  const { data: dataCourses, loading, error } = useQuery(GET_COURSES, {
    variables: { assignedToId: user?.user_id, academicYear: year },
  });

  const { data: dataPortal, loading: loadingPortal } = useQuery(GET_PORTAL, {
    variables: { academicYear: year },
  });

  useEffect(() => {
    const courses = dataCourses?.allCourses?.edges;
    const portals = dataPortal?.allPublishes?.edges;
    if (courses?.length > 0 && portals?.length > 0) {
      const si = courses.map((c: EdgeCourse) => parseInt(decodeUrlID(c.node.specialty.id) || "0"));
      const specialtyIDS = [...new Set<number>(si)];
      const filteredPublish = portals.filter((obj: EdgePublish) =>
        specialtyIDS.includes(parseInt(decodeUrlID(obj.node.specialty.id) || "0"))
      );
      setMyPortals(filteredPublish);
    }
  }, [dataCourses, dataPortal]);

  const [selectedCourse, setSelectedCourse] = useState<NodeCourse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (course: NodeCourse, ca: boolean, exam: boolean, resit: boolean) => {
    const portalList: string[] = [];
    if (ca) portalList.push("CA");
    if (exam) portalList.push("EXAM");
    if (resit) portalList.push("RESIT");
    if (portalList.length > 0) {
      setPortalTypes(portalList);
      setSelectedCourse(course);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

  const handleUpload = (type: string) => {
    if (!selectedCourse) return;
    closeModal();

    router.push({
      pathname: "/pagesAll/UploadMarks",
      params: {
        courseId: decodeUrlID(selectedCourse.id),
        specialtyId: decodeUrlID(selectedCourse.specialty?.id),
        semester: selectedCourse.semester,
        type,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <AppHeader showBack showTabs showTitle />

      {/* Scrollable Content */}
      {loading ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ActivityIndicator />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>
            📈 {t("portal.uploadMarks")} - {year}
          </Text>

          <SelectPicker
            selectedValue={year}
            onValueChange={(v) => setYear(v)}
            mode={Platform.OS === "android" ? "dropdown" : undefined}
            style={{ flex: 1, color: COLORS.textPrimary, marginBottom: 10 }}
            dropdownIconColor={COLORS.textSecondary}
          >
            {dataCourses?.allAcademicYears?.map((y: string) => (
              <SelectPicker.Item key={y} label={y} value={y} />
            ))}
          </SelectPicker>

          {dataCourses?.allCourses?.edges
            ?.filter((c: EdgeCourse) => c.node.specialty.academicYear === year)
            .map((item: EdgeCourse) => {
              const thisCourse = item.node;
              const semester = item.node.semester;
              const specialtyId = parseInt(decodeUrlID(item.node.specialty.id) || "0");
              const thisPortal = myPortals?.filter(
                (p: EdgePublish) =>
                  p.node.semester === semester &&
                  parseInt(decodeUrlID(p.node.specialty.id) || "0") === specialtyId
              );

              const anyOpen = true;
              let portalCa = false;
              let portalExam = false;
              let portalResit = false;
              if (thisPortal && thisPortal?.length > 0) {
                portalCa = thisPortal[0]?.node.portalCa;
                portalExam = thisPortal[0]?.node.portalExam;
                portalResit = thisPortal[0]?.node.portalResit;
              }

              return (
                <View key={thisCourse.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.cardTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisCourse.mainCourse.courseName}
                      </Text>
                      <Text
                        style={styles.cardSubtitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisCourse.specialty.mainSpecialty?.specialtyName} •{" "}
                        {thisCourse.specialty?.level?.level} • {t("portal.semester")}{" "}
                        {thisCourse?.semester}
                      </Text>
                    </View>
                  </View>

                  {/* Portal status */}
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={portalCa ? "checkmark-circle" : "close-circle"}
                      size={18}
                      color={portalCa ? "green" : "red"}
                    />
                    <Text style={styles.statusText}>{t("portal.caPortal")}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={portalExam ? "checkmark-circle" : "close-circle"}
                      size={18}
                      color={portalExam ? "green" : "red"}
                    />
                    <Text style={styles.statusText}>{t("portal.examPortal")}</Text>
                  </View>
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={portalResit ? "checkmark-circle" : "close-circle"}
                      size={18}
                      color={portalResit ? "green" : "red"}
                    />
                    <Text style={styles.statusText}>{t("portal.resitPortal")}</Text>
                  </View>

                  {/* Upload button */}
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: anyOpen ? COLORS.primary : COLORS.border }]}
                    disabled={!anyOpen}
                    onPress={() => openModal(thisCourse, portalCa, portalExam, portalResit)}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={18}
                      color={anyOpen ? "#fff" : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.btnText,
                        { color: anyOpen ? "#fff" : COLORS.textSecondary },
                      ]}
                    >
                      {t("portal.uploadMarks")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      )}

      {/* ✅ Modal Popup */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Ionicons name="close" size={22} color={COLORS.textDark} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
               {selectedCourse?.mainCourse?.courseName}
            </Text>

            {portalTypes?.map((p: string) => (
              <TouchableOpacity key={p} style={styles.modalBtn} onPress={() => handleUpload(p)}>
                <Text style={styles.modalBtnText}>
                  {t("portal.upload")} {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 90 },
  heading: { fontSize: 20, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 15 },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "95%",
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "95%",
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 6 },
  statusText: { fontSize: 14, color: COLORS.textPrimary },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: { fontSize: 14, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: { width: "100%", backgroundColor: COLORS.cardBackground, borderRadius: 12, padding: 20 },
  modalClose: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});

const GET_COURSES = gql`
  query GetData($assignedToId: Decimal!, $academicYear: String!) {
    allAcademicYears
    allCourses(assignedToId: $assignedToId, academicYear: $academicYear) {
      edges {
        node {
          id
          courseCode
          semester
          mainCourse { courseName }
          specialty {
            id
            academicYear
            mainSpecialty { specialtyName }
            level { level }
          }
        }
      }
    }
  }
`;

const GET_PORTAL = gql`
  query GetData($academicYear: String!) {
    allPublishes(academicYear: $academicYear) {
      edges {
        node {
          id
          semester
          portalCa
          portalExam
          portalResit
          specialty {
            id
            academicYear
            mainSpecialty { specialtyName }
          }
        }
      }
    }
  }
`;