import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AppHeaderProps = {
  showBack?: boolean;
  showTitle?: boolean;
  title?: string;
  showTabs?: boolean;
};

export default function AppHeader({ showBack, showTitle, title, showTabs }: AppHeaderProps) {
  const router = useRouter();
  const { user, schoolIdentification, language, setLanguage } = useAuthStore();
  const role = user?.role?.toLowerCase();

  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  // Load persisted language on mount
  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang && storedLang !== language) {
        setLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    })();
  }, []);

  // Whenever language changes in store, update i18n & persist
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      AsyncStorage.setItem("appLanguage", language);
    }
  }, [language]);

  const handleProfilePress = () => {
    switch (role) {
      case "teacher":
        router.push("/(auth)/select-campus");
        break;
      case "student":
        router.push("/(auth)/select-profile");
        break;
    }
  };
  const handleBellPress = () =>{
    router.push({
      pathname:"/pagesAll/announcements/announcements"
    })
  }
  const handleSelectLanguage = (lang: string) => {
    setLanguage(lang); // triggers store update, i18n change, and persistence
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Title */}
        {showTitle && (
          <View style={styles.center}>
            <Text style={styles.title}>
              {title || schoolIdentification?.name || "Welcome"}
            </Text>
          </View>
        )}

        {/* Right Section */}
        <View style={styles.right}>
          {/* ▼ Language dropdown toggle */}
          <TouchableOpacity style={styles.icon} onPress={() => setModalVisible(true)}>
            <Ionicons name="chevron-down" size={20} color="white" />
            <Text style={styles.langText}>{language?.toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.icon} onPress={handleBellPress}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={styles.icon} onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional Tabs */}
      {/* {showTabs && (
        <View style={styles.tabs}>
          <Text style={{ color: "#b92424ff" }}>Tabs Placeholder</Text>
        </View>
      )} */}

      {/* Language Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
          <Text >Select Language</Text>
            {[
              { code: "en", label: "English" },
              { code: "fr", label: "Français" },
            ].map(({ code, label }) => (
              <TouchableOpacity
                key={code}
                style={styles.modalItem}
                onPress={() => handleSelectLanguage(code)}
              >
                <Text style={styles.modalText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 99,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? 25 : 35,
    paddingBottom: 6,
    height: Platform.OS === "android" ? 55 : 65,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center", width: 60 },
  center: { flex: 1, alignItems: "center" },
  title: { color: "#fff", fontSize: 10, fontWeight: "700", textAlign: "center", width: 200 },
  right: { flexDirection: "row", alignItems: "center", width: 100 },
  icon: { marginHorizontal: 4, flexDirection: "row", alignItems: "center" },
  langText: { color: "#fff", marginLeft: 3, fontSize: 12, fontWeight: "600" },
  tabs: {
    marginTop: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: 180,
    alignItems: "center",
  },
  modalItem: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalText: { fontSize: 14, fontWeight: "600", color: COLORS.primary },
});
