import { useAuthStore } from "@/store/authStore";
import { protocol, RootApi, tenant } from "@/utils/config";
import { actionSubmit } from "@/utils/functions";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";

export default function EnterTokenScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { schoolIdentification } = useAuthStore();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleSupport = () => {
     const message = t("support.resetMessage");
     const url = `https://wa.me/${schoolIdentification?.supportNumberOne}?text=${encodeURIComponent(message)}`;
     Linking.openURL(url);
   };

  // ✅ Validate password rules
  const validatePassword = (password: string): boolean => {
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpper && hasNumber && hasMinLength;
  };

  const handleSubmit = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert(t("messages.error"), t("messages.allFieldsRequired"));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("messages.error"), t("messages.passwordMismatch"));
      return;
    }
    if (!validatePassword(newPassword)) {
      Alert.alert(t("messages.invalidPassword"), t("messages.passwordRules"));
      return;
    }

    setLoading(true);
    const url = `${protocol}${tenant}${RootApi}/password_reset/confirm/`;

    const res = await actionSubmit({ token, password: newPassword }, url);

    if (res?.status?.toString() === "OK") {
      Alert.alert(t("messages.success"), t("messages.passwordResetSuccess"), [
        { text: "OK", onPress: () => router.push("/(auth)") },
      ]);
    } else {
      Alert.alert(t("messages.error"), t("messages.passwordResetFailed"));
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.schoolName}>
          {schoolIdentification?.name || t("ui.mySchool")}
        </Text>

        <Text style={styles.title}>{t("login.enterToken")}</Text>
        <Text style={styles.subtitle}>{t("login.checkEmailToken")}</Text>

        {/* Token Input */}
        <TextInput
          style={styles.input}
          placeholder={t("login.enterToken")}
          placeholderTextColor={COLORS.placeholderText}
          value={token}
          onChangeText={setToken}
        />

        {/* Password Inputs */}
        <TextInput
          style={styles.input}
          placeholder={t("login.newPassword")}
          placeholderTextColor={COLORS.placeholderText}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder={t("login.confirmPassword")}
          placeholderTextColor={COLORS.placeholderText}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* ✅ Password rules */}
        <Text style={styles.passwordHint}>{t("messages.passwordHint")}</Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.button,
            !validatePassword(newPassword) && { backgroundColor: COLORS.border },
          ]}
          onPress={handleSubmit}
          disabled={loading || !validatePassword(newPassword)}
        >
          <Text style={styles.buttonText}>
            {loading ? t("ui.submitting") : t("ui.submit")}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleSupport}>
          <Text style={styles.link}>{t("ui.contactSupport")}</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>@2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  passwordHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: "left",
    width: "100%",
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});