import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/authStore";
import { capitalizeEachWord, capitalizeFirstLetter, decodeUrlID } from "@/utils/functions";
import { NodeComplain } from "@/utils/schemas/interfaceGraphql";
import { JwtPayload } from "@/utils/interfaces";

const CreateEditComplain = ({
  data,
  refetch,
  setShowDetail,
}: {
  data: NodeComplain | null;
  refetch: any;
  setShowDetail: any;
}) => {
  const { t } = useTranslation("common");
  const { token } = useAuthStore();
  const user: JwtPayload = jwtDecode(token || "");
  const isEditing = !!data?.id;

  const [submitting, setSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(!isEditing);
  const [formData, setFormData] = useState({
    complainType: data?.complainType || "others",
    message: data?.message || "",
  });

  const [createOrUpdateComplain] = useMutation(CREATE_UPDATE_COMPLAIN);

  const onSubmit = async () => {
    if (!formData.message.trim()) {
      alert("⚠️ Please enter your complaint message.");
      return;
    }

    setSubmitting(true);

    const variables = {
      id: isEditing ? decodeUrlID(data?.id || "") : null,
      complainType: formData.complainType,
      message: formData.message.trim(),
      customuserId: user?.user_id,
      updatedById: user?.user_id,
      createdById: isEditing && data?.createdBy
        ? decodeUrlID(data.createdBy.id)
        : user?.user_id,
      delete: false,
    };

    console.log("Submitting:", variables);

    try {
      const res = await createOrUpdateComplain({ variables });
      if (res?.data?.createUpdateDeleteComplain?.complain?.id) {
        refetch?.();
        alert(isEditing ? "✅ Complaint updated successfully!" : "✅ Complaint submitted successfully!");
        setShowDetail({ show: false, selectedItem: null });
      }
    } catch (error) {
      console.error(error);
      alert("❌ Operation failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEditing
          ? capitalizeEachWord(t("edit complaint"))
          : capitalizeEachWord(t("create complaint"))}
      </Text>

      {showSettings ? (
        <SettingComp
          formData={formData}
          setFormData={setFormData}
          t={t}
          isEditing={isEditing}
        />
      ) : (
        <View style={styles.buttonsRow}>
          <Button title="⚙️" onPress={() => setShowSettings(true)} />
          <Button
            title={isEditing ? capitalizeEachWord(t("update")) : capitalizeEachWord(t("submit"))}
            onPress={onSubmit}
          />
        </View>
      )}

      {submitting && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />}
    </ScrollView>
  );
};

export default CreateEditComplain;

const SettingComp = ({ t, formData, setFormData, isEditing }: any) => (
  <View style={styles.settingsContainer}>
    <Text style={styles.label}>{capitalizeFirstLetter(t("complaint type"))}:</Text>

    <View style={styles.pickerContainer}>
      <TextInput
        value={formData.complainType}
        onChangeText={(text) => setFormData({ ...formData, complainType: text })}
        placeholder={capitalizeEachWord(t("enter type (e.g. results, fees, others)"))}
        style={styles.input}
      />
    </View>

    <Text style={styles.label}>{capitalizeFirstLetter(t("message"))}:</Text>
    <TextInput
      value={formData.message}
      onChangeText={(text) => setFormData({ ...formData, message: text })}
      placeholder={capitalizeFirstLetter(t("describe your complaint here"))}
      style={[styles.input, styles.textArea]}
      multiline
      numberOfLines={4}
    />

    <Button
      title={isEditing ? capitalizeEachWord(t("update")) : capitalizeEachWord(t("submit"))}
      onPress={() => setFormData({ ...formData })}
    />
  </View>
);

const CREATE_UPDATE_COMPLAIN = gql`
  mutation Data(
    $id: ID
    $complainType: String!
    $message: String!
    $customuserId: ID!
    $createdById: ID!
    $updatedById: ID!
    $delete: Boolean!
  ) {
    createUpdateDeleteComplain(
      id: $id
      complainType: $complainType
      message: $message
      customuserId: $customuserId
      createdById: $createdById
      updatedById: $updatedById
      delete: $delete
    ) {
      complain {
        id
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  settingsContainer: {
    width: "100%",
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  pickerContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
});
