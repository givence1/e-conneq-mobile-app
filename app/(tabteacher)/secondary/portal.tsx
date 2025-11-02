import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeEachWord, capitalizeFirstLetter, decodeUrlID, getAcademicYear } from "@/utils/functions";
import { EdgePublishSecondary } from "@/utils/schemas/interfaceGraphqlPrimary";
import { EdgeSubjectSec, EdgeSubSubjectSec, NodeSubjectSec } from "@/utils/schemas/interfaceGraphqlSecondary";
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


export default function LecturerPortalScreen() {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [year, setYear] = useState(getAcademicYear());
  const [tab, setTab] = useState<"main" | "minor">("main");
  const [myPortals, setMyPortals] = useState<EdgePublishSecondary[]>();
  const [portalTypes, setPortalTypes] = useState<string[]>();

  const { data: dataSubjects, loading: loadingSubjects, error } = useQuery(GET_SUBJECTS, {
    variables: { assignedToId: user?.user_id, academicYear: year },
  });

  const { data: dataPortal, loading: loadingPortals } = useQuery(GET_PORTAL, {
    variables: { academicYear: year },
  });

  useEffect(() => {
    const subjects = dataSubjects?.allSubjectsSec?.edges;
    const portals = dataPortal?.allPublishSec?.edges;
    if (subjects?.length > 0 && portals?.length > 0) {
      const si = subjects.map((c: EdgeSubjectSec) => parseInt(decodeUrlID(c.node.classroomsec.id) || "0"));
      const classroomsecIDS = [...new Set<number>(si)];
      const filteredPublish = portals.filter((obj: EdgePublishSecondary) =>
        classroomsecIDS.includes(parseInt(decodeUrlID(obj.node.classroomsec.id) || "0"))
      );
      setMyPortals(filteredPublish);
    }
  }, [dataSubjects, dataPortal]);

  const [selectedSubject, setSelectedSubject] = useState<NodeSubjectSec | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (subject: NodeSubjectSec, portalStates: any) => {
    const portalList: string[] = [];
    if (portalStates.seq1) portalList.push("seq_1");
    if (portalStates.seq2) portalList.push("seq_2");
    if (portalStates.seq3) portalList.push("seq_3");
    if (portalStates.seq4) portalList.push("seq_4");
    if (portalStates.seq5) portalList.push("seq_5");
    if (portalStates.seq6) portalList.push("seq_6");
    if (portalList.length > 0) {
      setPortalTypes(portalList);
      setSelectedSubject(subject);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSubject(null);
  };

  const handleUpload = (type: string) => {
    if (!selectedSubject) return;
    closeModal();

    router.push({
      pathname: "/pagesAll/UploadMarksSec",
      params: {
        minor: (selectedSubject.hasSubSubjects)?.toString(),
        subjectId: decodeUrlID(selectedSubject.id),
        classroomsecId: decodeUrlID(selectedSubject.classroomsec?.id),
        type,
      },
    });
  };

  return (
    <View style={styles.container}>

      <AppHeader showBack showTabs showTitle />


      {loadingSubjects || loadingPortals ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ActivityIndicator />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>
            📈 {t("portal.uploadMarks")} - {year}
          </Text>

          {/* SELECT YEAR */}
          <SelectPicker
            selectedValue={year}
            onValueChange={(v) => setYear(v)}
            mode={Platform.OS === "android" ? "dropdown" : undefined}
            style={{ flex: 1, color: COLORS.textPrimary, marginBottom: 10 }}
            dropdownIconColor={COLORS.textSecondary}
          >
            {dataSubjects?.allAcademicYearsSec?.map((y: string) => (
              <SelectPicker.Item key={y} label={y} value={y} />
            ))}
          </SelectPicker>


          {/* TAB MAIN / SUB-SUBJECTS */}
          <View style={styles.tabContainer}>
            <View style={styles.tabWrapper}>
              {["main", "minor"].map((type: any) => (
                <Text
                  key={type}
                  onPress={() => setTab(type)}
                  style={[
                    styles.tabItem,
                    tab === type && styles.activeTabItem,
                  ]}
                >
                  {capitalizeEachWord(t(type === "main" ? "main subjects" : "minor subjects"))}
                </Text>
              ))}
            </View>
          </View>

          {/* <Text>
            {showSubSubject === "true" ? `${capitalizeEachWord(t("minor subjects"))}` : `${capitalizeEachWord(t("main subjects"))}`}
          </Text> */}



          {/* MAIN SUBJECTS */}
          {tab === "main" ?
          dataSubjects?.allSubjectsSec?.edges
            ?.filter((c: EdgeSubjectSec) => c.node.classroomsec.academicYear === year)
            ?.filter((c: EdgeSubjectSec) => !c.node.hasSubSubjects)
            .map((item: EdgeSubjectSec) => {
              const thisSubject = item.node;
              const classroomsecId = parseInt(decodeUrlID(item.node.classroomsec.id) || "0");
              const thisPortal = myPortals?.filter(
                (p: EdgePublishSecondary) =>
                  parseInt(decodeUrlID(p.node.classroomsec.id) || "0") === classroomsecId
              );

              if (!thisPortal || thisPortal && thisPortal?.length < 1) {
                return <View key={thisSubject.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.cardTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisSubject.mainsubject.subjectName}
                      </Text>
                      <Text style={{ color: "red" }}>{capitalizeEachWord(t("no portal found"))} - {thisSubject.classroomsec.level}</Text>
                    </View>
                  </View>
                </View>
              }

              const anyOpen = true;
              let portalSeq = thisPortal[0]?.node.portalSeq;
              const sequences = Object.keys(portalSeq).filter((i) => i.includes("seq"))

              return (
                <View key={thisSubject.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.cardTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisSubject.mainsubject.subjectName}
                      </Text>
                      <Text
                        style={styles.cardSubtitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisSubject.classroomsec.level} •{" "}
                        {thisSubject.classroomsec?.classType} •{" "}
                        {thisSubject.classroomsec?.series?.name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusGrid}>
                    {sequences?.map((seq: string) => (
                      <View key={seq} style={styles.statusRowGrid}>
                        <Ionicons
                          name={portalSeq[seq] ? "checkmark-circle" : "close-circle"}
                          size={18}
                          color={portalSeq[seq] ? "green" : "red"}
                        />
                        <Text style={styles.statusText}>
                          {capitalizeFirstLetter(seq.replace("_", " "))}
                        </Text>
                      </View>
                    ))}
                  </View>


                  {/* Upload button */}
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: anyOpen ? COLORS.primary : COLORS.border }]}
                    disabled={!anyOpen}
                    onPress={() => openModal(thisSubject, portalSeq)}
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
            })
            :
            null}



          {/* MINOR SUBJECTS */}
          {tab === "minor" ?
          dataSubjects?.allSubSubjectSec?.edges
            ?.filter((c: EdgeSubSubjectSec) => c.node.subjectsec?.classroomsec.academicYear === year)
            // ?.filter((c: EdgeSubjectSec) => c.node.hasSubSubjects)
            .map((item: EdgeSubSubjectSec) => {
              const thisSubject = item.node?.subjectsec;
              const classroomsecId = parseInt(decodeUrlID(item.node?.subjectsec.classroomsec.id) || "0");
              const thisPortal = myPortals?.filter(
                (p: EdgePublishSecondary) =>
                  parseInt(decodeUrlID(p.node.classroomsec.id) || "0") === classroomsecId
              );

              if (!thisPortal || thisPortal && thisPortal?.length < 1) {
                return <View key={thisSubject.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.cardTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisSubject.mainsubject.subjectName}
                      </Text>
                      <Text style={{ color: "red" }}>{capitalizeEachWord(t("no portal found"))} - {thisSubject.classroomsec.level}</Text>
                    </View>
                  </View>
                </View>
              }

              const anyOpen = true;
              let portalSeq = thisPortal[0]?.node.portalSeq;
              const sequences = Object.keys(portalSeq).filter((i) => i.includes("seq"))

              return (
                <View key={thisSubject.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.cardTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisSubject?.mainsubject.subjectName}
                      </Text>
                      <Text
                        style={styles.cardSubtitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {thisSubject?.classroomsec.level} •{" "}
                        {thisSubject?.classroomsec?.classType} •{" "}
                        {thisSubject?.classroomsec?.series?.name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusGrid}>
                    {sequences?.map((seq: string) => (
                      <View key={seq} style={styles.statusRowGrid}>
                        <Ionicons
                          name={portalSeq[seq] ? "checkmark-circle" : "close-circle"}
                          size={18}
                          color={portalSeq[seq] ? "green" : "red"}
                        />
                        <Text style={styles.statusText}>
                          {capitalizeFirstLetter(seq.replace("_", " "))}
                        </Text>
                      </View>
                    ))}
                  </View>


                  {/* Upload button */}
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: anyOpen ? COLORS.primary : COLORS.border }]}
                    disabled={!anyOpen}
                    onPress={() => openModal(thisSubject, portalSeq)}
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
            })
          :
          null}




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
              {t("portal.chooseType")} {selectedSubject?.mainsubject?.subjectName}
            </Text>

            {portalTypes?.map((p: string) => (
              <TouchableOpacity key={p} style={styles.modalBtn} onPress={() => handleUpload(p)}>
                <Text style={styles.modalBtnText}>
                  {t("portal.upload")} {p.replace("seq_", "sequence ").toUpperCase()}
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 100 },
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
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // distribute across 3 columns
    rowGap: 4, // vertical spacing
    columnGap: 8, // horizontal spacing
    marginVertical: 4,
  },
  statusRowGrid: {
    width: "30%", // roughly 3 per row
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f9f9f9",
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 8,
    elevation: 1, // small shadow on Android
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

   tabContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 4,
    marginTop: 8,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabItem: {
    backgroundColor: COLORS.primary,
    color: "#fff",
  },

});



const GET_SUBJECTS = gql`
  query GetData(
    $assignedToId: Decimal!,
    $academicYear: String!
  ) {
    allAcademicYearsSec
    allSubjectsSec(
      assignedToId: $assignedToId,
      academicYear: $academicYear
    ) {
      edges {
        node {
          id
          mainsubject { subjectName subjectCode }
          classroomsec {
            id academicYear level classType
            series { name }
          }
            hasSubSubjects
        }
      }
    }
    allSubSubjectSec (
      assignedToId: $assignedToId,
    ) {
      edges {
        node {
          id
          subjectsec {
            id
            mainsubject { subjectName subjectCode }
            classroomsec {
              id academicYear level classType
              series { name }
            }
          }
        }
      }
    }
  }
`;

const GET_PORTAL = gql`
  query GetData(
    $academicYear: String!
  ) {
    allPublishSec(
      academicYear: $academicYear
    ) {
      edges {
        node {
          id
          portalSeq {
            seq1 seq2 seq3 seq4 seq5 seq6
          }
          classroomsec {
            id academicYear level
          }
        }
      }
    }
  }
`;