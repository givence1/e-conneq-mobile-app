import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../assets/styles/login.styles";



export default function Login() {
  const { storeParentNumber } = useAuthStore();
  const [matricle, setMatricle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [parent, setParent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const {
    isLoading,
    login,
    isCheckingAuth,
    schoolIdentification,
    checkAuth,
    language,
    setLanguage,
  } = useAuthStore();

  const { t } = useTranslation();
  const router = useRouter();

  // ✅ Load saved credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedMatricle = await AsyncStorage.getItem("savedMatricle");
        const savedPassword = await AsyncStorage.getItem("savedPassword");
        const savedParent = await AsyncStorage.getItem("savedParent");

        if (savedMatricle && savedPassword) {
          setMatricle(savedMatricle);
          setPassword(savedPassword);
          setParent(savedParent === "true");
          setRememberMe(true);
          if (savedParent === "true"){
            storeParentNumber(savedMatricle)
          }
        }
      } catch (error) {
        console.error("Error loading credentials:", error);
      }
    };

    loadCredentials();
  }, []);

  // ✅ Save or clear credentials after login
  const handleLogin = async () => {
    if (!parent && matricle.trim().length < 4) {
      Alert.alert(
        t("login.invalidInput"),
        t("login.matricule") + " " + t("login.error")
      );
      return;
    }

    if (parent && matricle.trim().length < 7) {
      Alert.alert(
        t("login.invalidInput"),
        t("login.asParent") + " - " + t("login.error")
      );
      return;
    }

    if (password.trim().length < 4) {
      Alert.alert(t("login.invalidInput"), t("login.password"));
    }
    // return

    try {
      const result = await login({ matricle, password, parent });
      if (!result?.token || result.token.length < 10) {
        Alert.alert(t("login.loginFailed"), t("login.invalidCredentials"));
      } else {
        if (parent) {
          storeParentNumber(matricle);
        }
        if (rememberMe) {
          await AsyncStorage.setItem("savedMatricle", matricle);
          await AsyncStorage.setItem("savedPassword", password);
          await AsyncStorage.setItem("savedParent", parent.toString());
        } else {
          await AsyncStorage.removeItem("savedMatricle");
          await AsyncStorage.removeItem("savedPassword");
          await AsyncStorage.removeItem("savedParent");
        }
      }
    } catch (error) {
      Alert.alert(t("login.error"));
    }
  };

  const handleSupport = () => {
    const message = "Hello, I need help with my login.";
    const url = `https://wa.me/${schoolIdentification?.supportNumberOne}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  if (isCheckingAuth) return null;

  if (!schoolIdentification) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
      >
        <Text style={{ fontSize: 18, color: "red", marginBottom: 12 }}>
          {schoolIdentification?.name || t("login.checkInternet")}
        </Text>
        <TouchableOpacity onPress={() => checkAuth()} style={styles.button}>
          <Text style={styles.buttonText}>{t("ui.retry", "Retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Language Toggle */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 16 }}>
          <TouchableOpacity onPress={() => setLanguage("en")} style={{ marginRight: 8 }}>
            <Text
              style={{
                color: language === "en" ? COLORS.primary : COLORS.placeholderText,
                fontWeight: "bold",
              }}
            >
              EN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage("fr")}>
            <Text
              style={{
                color: language === "fr" ? COLORS.primary : COLORS.placeholderText,
                fontWeight: "bold",
              }}
            >
              FR
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header with Logo + School Name */}
        <View
          style={{
            alignItems: "center",
            gap: 40,
            paddingTop: 50,
            paddingBottom: 30,
            backgroundColor: COLORS.background,
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 28,
              fontWeight: "700",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {schoolIdentification?.name || t("login.loginButton")}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.formContainer}>
              {/* Header with Toggle Button */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: "700", color: COLORS.primary }}>
                  {parent ? t("login.loginAsParent") : t("login.loginButton")}
                </Text>

                <TouchableOpacity
                  onPress={() => setParent(!parent)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.primary,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 30,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600", marginRight: 6 }}>
                    {parent ? t("login.back") : t("login.asParent")}
                  </Text>
                  <Ionicons
                    name={parent ? "arrow-back" : "arrow-forward"}
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* Username / Phone */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name={parent ? "call-outline" : "person-outline"}
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={parent ? t("login.asParent") : t("login.matricule")}
                    placeholderTextColor={COLORS.placeholderText}
                    value={matricle}
                    onChangeText={setMatricle}
                    keyboardType={parent ? "phone-pad" : "default"}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t("login.password")}
                    placeholderTextColor={COLORS.placeholderText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me Toggle */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <Switch value={rememberMe} onValueChange={setRememberMe} />
                <Text style={{ marginLeft: 8 }}>{t("login.rememberMe")}</Text>
              </View>

              {/* Links */}
              <View style={styles.linkRow}>
                <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
                  <Text style={styles.linkText}>{t("login.forgotPassword")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/(auth)/enter-token")}>
                  <Text style={styles.linkText}>{t("login.enterToken")}</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {parent ? t("login.loginAsParent") : t("login.loginButton")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Support Links */}
              <View style={styles.linkRow}>
                <TouchableOpacity onPress={handleSupport}>
                  <Text style={styles.linkText}>
                    {t("ui.contactSupport", "Contact Support")}
                  </Text>
                </TouchableOpacity>
                
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Link href="/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.link}>{t("login.register")}</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}