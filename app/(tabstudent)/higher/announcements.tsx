import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🔹 GraphQL Query
const GET_NOTIFICATIONS = gql`
  query {
    allNotifications {
      edges {
        node {
          id
          subject
          message
          notificationType
          scheduledFor
          recipients
          sent
        }
      }
    }
  }
`;

// 🔹 Helpers
const shortLine = (text: string | null | undefined, max = 80) => {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.substring(0, max - 1).trim() + "…" : t;
};

const timeAgo = (date: string) => {
  if (!date) return "";
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "yesterday";
  return new Date(date).toLocaleDateString();
};

// 🔹 Icon & color by type
const typeIcon = (type?: string) => {
  switch (type) {
    case "urgent":
      return { icon: "alert-circle", color: "#E63946" };
    case "reminder":
      return { icon: "clock", color: "#F4A261" };
    case "class":
      return { icon: "book", color: "#2A9D8F" };
    case "info":
      return { icon: "information-circle", color: "#457B9D" };
    default:
      return { icon: "notifications", color: COLORS.primary };
  }
};

export default function AnnouncementsScreen() {
  const { t, i18n } = useTranslation();
  const { language } = useAuthStore();

  // 🗣 Sync language
  useEffect(() => {
    if (language && i18n.language !== language) i18n.changeLanguage(language);
  }, [language]);

  // 🕐 Query with auto-refresh every 30s
  const { data, loading, error, refetch } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 30000,
    fetchPolicy: "network-only",
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 📋 Process notifications
  const notifications = useMemo(() => {
    return (
      data?.allNotifications?.edges
        ?.map((e: any) => e.node)
        ?.filter(
          (n: any) =>
            n &&
            (n.sent === true || n.sent === undefined) &&
            n.recipients?.toLowerCase() === "student"
        )
        ?.sort((a: any, b: any) => {
          const da = a?.scheduledFor ? new Date(a.scheduledFor).getTime() : 0;
          const db = b?.scheduledFor ? new Date(b.scheduledFor).getTime() : 0;
          return db - da;
        }) || []
    );
  }, [data]);

  // 🔄 Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // 🔔 Push registration
  useEffect(() => {
    let subscription: any;
    async function register() {
      try {
        if (!Device.isDevice) return;
        const { status: s } = await Notifications.getPermissionsAsync();
        let finalStatus = s;
        if (s !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") return;
        const tokenData = await Notifications.getExpoPushTokenAsync();
        console.log("Expo push token:", tokenData.data);
      } catch (e) {
        console.warn("Notification error:", e);
      }
      subscription = Notifications.addNotificationReceivedListener((n) => {
        console.log("Foreground notification:", n.request.content);
      });
    }
    register();
    return () => subscription?.remove();
  }, []);

  // 💬 Modal
  const openDetail = (item: any) => {
    setSelected(item);
    setModalVisible(true);
  };

  if (loading && !refreshing)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 8, color: COLORS.textPrimary }}>
          {t("announcement.loading")}
        </Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{t("announcement.loadError")}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTabs showTitle />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={notifications}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingTop: 60, paddingBottom: 80, paddingHorizontal: 12 }}
          ListHeaderComponent={
            <>
              <Text style={styles.pageTitle}>{t("announcement.title")}</Text>
              <Text style={styles.pageSubtitle}>{t("announcement.subtitle")}</Text>
            </>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            const { icon, color } = typeIcon(item.notificationType);
            return (
              <TouchableOpacity onPress={() => openDetail(item)} activeOpacity={0.85}>
                <View style={[styles.card, { borderLeftColor: color }]}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={icon as any} size={22} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.subject}</Text>
                    <Text style={styles.cardMessage}>{shortLine(item.message, 72)}</Text>
                    <View style={styles.timeRow}>
                      <Feather name="clock" size={13} color={COLORS.textSecondary} />
                      <Text style={styles.timeText}>
                        {" " + timeAgo(item.scheduledFor)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={() => (
            <View style={{ paddingTop: 40 }}>
              <Text style={{ color: COLORS.textPrimary, textAlign: "center" }}>
                {t("announcement.noData")}
              </Text>
            </View>
          )}
        />

        {/* 🪟 Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.modalSubject}>{selected?.subject}</Text>
              {selected?.scheduledFor && (
                <Text style={styles.modalDate}>{timeAgo(selected.scheduledFor)}</Text>
              )}
              <View style={styles.divider} />
              <Text style={styles.modalMessage}>{selected?.message}</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  pageTitle: { fontSize: 22, fontWeight: "700", color: COLORS.primary, textAlign: "center", marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: COLORS.textPrimary, textAlign: "center", marginBottom: 16 },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrap: {
    marginRight: 12,
    backgroundColor: "#F6F8FA",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textDark },
  cardMessage: { fontSize: 13, color: COLORS.textPrimary, marginTop: 4 },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  timeText: { fontSize: 12, color: COLORS.textSecondary },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "45%",
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  modalClose: { position: "absolute", right: 20, top: 16, padding: 4 },
  modalSubject: { fontSize: 20, fontWeight: "700", color: COLORS.primary, marginTop: 10 },
  modalDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  modalMessage: { fontSize: 16, color: COLORS.textDark, lineHeight: 22 },
});
