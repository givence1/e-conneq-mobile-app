import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeFirstLetter, decodeUrlID } from "@/utils/functions";
import { EdgeComplain, NodeComplain } from "@/utils/schemas/interfaceGraphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const today = new Date();
const futureDate = new Date(today);
futureDate.setMonth(today.getMonth() + 2);

const LecturerComplaint: React.FC = () => {
  const { t } = useTranslation();
  const { user, role, campusInfo } = useAuthStore();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: t("ui.lecturerMisconduct"), value: "student" },
    { label: t("ui.attendance"), value: "attendance" },
    { label: t("ui.salary"), value: "salary" },
    { label: t("ui.availability"), value: "availability" },
    { label: t("ui.resultProblem"), value: "results" },
    { label: t("ui.other"), value: "others" },
  ]);

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const { data, loading, refetch } = useQuery(GET_COMPLAINS, {
    variables: { customerId: user?.user_id, role },
    skip: !user?.user_id || !role,
  });

  const [createUpdateDeleteComplain] = useMutation(CREATE_COMPLAIN);

  const handleSubmit = async () => {
    if (!type || !message.trim()) {
      Alert.alert(t("ui.error"), t("ui.errorMessage"));
      return;
    }console.log("🚀 handleSubmit called");
    console.log("Auth Store:", { user, role, campusInfo });



   console.warn("📤 Complaint Data Submitted:", {
  customerId: String(user?.user_id),
  campusId: decodeUrlID(campusInfo?.id || ""),
  message,
  complainType: type,
  endingAt: futureDate.toISOString().split("T")[0],
  delete: false,
  status: false,
});

Alert.alert("Debug Log", `Type: ${type}\nMessage: ${message}`);


    try {
      const res = await createUpdateDeleteComplain({
        variables: {
          customerId: String(user?.user_id),
          campusId: decodeUrlID(campusInfo?.id || ""),
          message,
          complainType: type,
          endingAt: futureDate.toISOString().split("T")[0],
          delete: false,
          status: false,
        },
      });

      if (res?.data?.createUpdateDeleteComplain?.complain?.id?.length > 5) {
        Alert.alert(t("ui.submitted"), t("ui.submittedMessage"));
        setType(null);
        setMessage("");
        setModalVisible(false);
        refetch();
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t("ui.error"), t("ui.serverError"));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.wrapper}>
      <AppHeader showBack showTitle />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : data?.allComplains?.edges?.length ? (
          <FlatList
            data={data.allComplains.edges}
            keyExtractor={(edge: EdgeComplain) => edge.node.id.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }: { item: EdgeComplain }) => {
              const c: NodeComplain = item.node;
              const isExpanded = expanded[c.id];
              const previewText =
                c.message.length > 100
                  ? c.message.substring(0, 100) + "..."
                  : c.message;

              return (
                <View style={styles.card}>
                  <Text style={styles.cardType}>
                    {capitalizeFirstLetter(c.complainType)}
                  </Text>

                  <Text style={styles.cardMsg}>
                    {isExpanded ? c.message : previewText}
                  </Text>

                  {c.message.length > 100 && (
                    <TouchableOpacity onPress={() => toggleExpand(c.id)}>
                      <Text style={styles.readMore}>
                        {isExpanded ? t("ui.readLess") : t("ui.readMore")}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {c.status ? (
                    <Text style={styles.cardResolved}>{t("ui.resolved")}</Text>
                  ) : c.response ? (
                    <Text style={styles.cardResponse}>
                      {t("ui.response")}: {c.response}
                    </Text>
                  ) : (
                    <Text style={styles.cardPending}>{t("ui.pending")}</Text>
                  )}

                  <Text style={styles.cardDate}>
                    {new Date(c.updatedAt).toLocaleString()}
                  </Text>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{t("ui.noComplaints")}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{t("ui.submitComplaint")}</Text>

              <Text style={styles.label}>{t("ui.complaintType")}</Text>
              <DropDownPicker
                open={open}
                value={type}
                items={items}
                setOpen={setOpen}
                setValue={setType}
                setItems={setItems}
                placeholder={t("ui.selectType")}
                style={styles.dropdown}
                dropDownContainerStyle={{ borderColor: "#ccc" }}
              />

              <Text style={styles.label}>{t("ui.message")}</Text>
              <TextInput
                placeholder={t("ui.describeIssue")}
                value={message}
                onChangeText={setMessage}
                style={[styles.input, { height: 120 }]}
                multiline
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary]}
                  style={styles.gradientBtn}
                >
                  <Text style={styles.buttonText}>{t("ui.submitComplaint")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LecturerComplaint;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    paddingTop: 70,
    marginBottom: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardType: { fontWeight: "700", color: COLORS.primary },
  cardMsg: { marginTop: 4, color: COLORS.textPrimary },
  cardResponse: { marginTop: 6, color: "green" },
  cardPending: { marginTop: 6, color: "orange" },
  cardResolved: { marginTop: 6, color: "blue", fontWeight: "600" },
  readMore: { color: COLORS.primary, marginTop: 4 },
  cardDate: { marginTop: 4, fontSize: 12, color: COLORS.textSecondary },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "70%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.textPrimary,
  },
  label: {
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: COLORS.textPrimary,
  },
  dropdown: {
    borderColor: "#ccc",
    marginBottom: 10,
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  submitBtn: {
    marginTop: 10,
  },
  gradientBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});


// ---------- GraphQL ----------
const GET_COMPLAINS = gql`
  query GetComplains($customerId: ID!, $role: String!) {
    allComplains(
      role: $role
      last: 20
      customerId: $customerId
      deleted: false
    ) {
      edges {
        node {
          id
          message
          response
          status
          complainType
          updatedAt
        }
      }
    }
  }
`;

const CREATE_COMPLAIN = gql`
  mutation CRUDComplain(
    $customerId: ID!
    $campusId: ID!
    $message: String!
    $complainType: String!
    $endingAt: String!
    $delete: Boolean!
    $status: Boolean!
  ) {
    createUpdateDeleteComplain(
      customerId: $customerId
      campusId: $campusId
      message: $message
      complainType: $complainType
      endingAt: $endingAt
      status: $status
      delete: $delete
    ) {
      complain {
        id
      }
    }
  }
`;
