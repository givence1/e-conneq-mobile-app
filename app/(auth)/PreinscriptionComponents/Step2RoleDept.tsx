import styles from "@/assets/styles/signup.styles";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Yup from "yup";
import StepIndicator from "./StepIndicator";

type Step2Props = {
  data: Record<string, string>;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  section: "H" | "S" | "P" | "V";
  apiSchools: string[];
};

export default function Step2RoleDept({
  data,
  updateField,
  onNext,
  onPrevious,
  apiSchools,
}: Step2Props) {
  const { t } = useTranslation();

  const optionsMap: Record<string, string[]> = {
    campusId: apiSchools,
    nationality: [t("nationalities.cameroon"), t("nationalities.international")],
    regionOfOrigin: [
      t("regions.southWest"),
      t("regions.northWest"),
      t("regions.west"),
      t("regions.south"),
      t("regions.center"),
      t("regions.littoral"),
      t("regions.east"),
      t("regions.adamawa"),
      t("regions.nord"),
      t("regions.farNord"),
      t("regions.Others"),
    ],
    highestCertificate: [
      t("certificates.olevel"),
      t("certificates.alevel"),
      t("certificates.hnd"),
      t("certificates.bachelor"),
      t("certificates.master"),
      t("certificates.bacaleaureat"),
      t("certificates.bts"),
      t("certificates.probatoire"),
      t("certificates.bepc"),
      t("certificates.others"),
    ],
    yearObtained: Array.from({ length: 15 }, (_, i) => `${new Date().getFullYear() - i}`),
  };

  const validationSchema = Yup.object().shape({
    campusId: Yup.string().required(t("validation.required", { field: t("form.campusId") })),
    nationality: Yup.string().required(t("validation.required", { field: t("form.nationality") })),
    regionOfOrigin: Yup.string().required(t("validation.required", { field: t("form.regionOfOrigin") })),
    highestCertificate: Yup.string().required(t("validation.required", { field: t("form.highestCertificate") })),
    yearObtained: Yup.string().required(t("validation.required", { field: t("form.yearObtained") })),
    grade: Yup.string().required(t("validation.required", { field: t("form.grade") })),
    fatherName: Yup.string().required(t("validation.required", { field: t("form.fatherName") })),
    fatherTelephone: Yup.string().required(t("validation.required", { field: t("form.fatherTelephone") })),
    motherName: Yup.string().required(t("validation.required", { field: t("form.motherName") })),
    motherTelephone: Yup.string().required(t("validation.required", { field: t("form.motherTelephone") })),
    parentAddress: Yup.string().required(t("validation.required", { field: t("form.parentAddress") })),
  });

  const [popupField, setPopupField] = useState<string | null>(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 70}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: 40, flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StepIndicator idx={1} />

          <Formik
            initialValues={data} // start with parent data
            enableReinitialize // ✅ syncs when going back
            validationSchema={validationSchema}
            onSubmit={(values) => {
              Object.keys(values).forEach((k) => updateField(k, values[k])); // push all values to parent
              onNext();
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
              <View style={styles.formContainer}>
                {/* Dropdown Fields */}
                {Object.keys(optionsMap).map((field) => (
                  <View key={field} style={styles.inputGroup}>
                    <Text style={styles.label}>{t(`form.${field}`)}</Text>
                    <TouchableOpacity
                      onPress={() => setPopupField(field)}
                      style={[styles.inputContainer, { justifyContent: "flex-start" }]}
                    >
                      <Ionicons
                        name="chevron-down-outline"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <Text style={[styles.input, { paddingVertical: 12 }]}>
                        {values[field] || t("form.selectField", { field: t(`form.${field}`) })}
                      </Text>
                    </TouchableOpacity>
                    {errors[field] && touched[field] && (
                      <Text style={{ color: "red", fontSize: 12 }}>{errors[field]}</Text>
                    )}

                    {/* Popup modal */}
                    {popupField === field && (
                      <Modal transparent animationType="fade" visible={true}>
                        <View style={local.popupOverlay}>
                          <View style={local.popupContainer}>
                            <Text style={local.popupTitle}>
                              {t("form.selectField", { field: t(`form.${field}`) })}
                            </Text>
                            <FlatList
                              data={optionsMap[field]}
                              keyExtractor={(item) => item}
                              renderItem={({ item }) => (
                                <Pressable
                                  style={local.popupItem}
                                  onPress={() => {
                                    setFieldValue(field, item);
                                    setPopupField(null);
                                  }}
                                >
                                  <Text style={local.popupItemText}>{item}</Text>
                                </Pressable>
                              )}
                            />
                            <Pressable onPress={() => setPopupField(null)} style={local.popupCancel}>
                              <Text style={local.popupCancelText}>{t("actions.cancel")}</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Modal>
                    )}
                  </View>
                ))}

                {/* Manual Text Inputs */}
                {[
                  { key: "grade", label: t("form.grade") },
                  { key: "fatherName", label: t("form.fatherName") },
                  { key: "fatherTelephone", label: t("form.fatherTelephone") },
                  { key: "motherName", label: t("form.motherName") },
                  { key: "motherTelephone", label: t("form.motherTelephone") },
                  { key: "parentAddress", label: t("form.parentAddress") },
                ].map(({ key, label }) => (
                  <View key={key} style={styles.inputGroup}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder={label}
                        placeholderTextColor={COLORS.placeholderText}
                        value={values[key] || ""}
                        onChangeText={handleChange(key)}
                      />
                    </View>
                    {errors[key] && touched[key] && (
                      <Text style={{ color: "red", fontSize: 12 }}>{errors[key]}</Text>
                    )}
                  </View>
                ))}

                {/* Navigation Buttons */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 24 }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: COLORS.border, flex: 1 }]}
                    onPress={onPrevious}
                  >
                    <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>
                      {t("actions.back")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>{t("actions.next")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const local = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "60%",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  popupItem: {
    paddingVertical: 10,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  popupItemText: {
    fontSize: 16,
  },
  popupCancel: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  popupCancelText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});