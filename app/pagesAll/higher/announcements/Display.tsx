import { capitalizeEachWord } from "@/utils/functions";
import { EdgeComplain } from "@/utils/schemas/interfaceGraphql";
import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  data: EdgeComplain[];
  setShowDetail: any;
}

const Display: React.FC<Props> = ({ data, setShowDetail }) => {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: EdgeComplain }) => {
    const statusText = item.node.status ? "Resolved" : "Pending";
    const statusColor = item.node.status ? "#4CAF50" : "#b61307ff";

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.type}>{item.node?.complainType.toUpperCase()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        <Text style={styles.message}>{item.node?.message}</Text>

        {/* Footer row: date + button */}
        <View style={styles.footerRow}>
          <Text style={styles.date}>
            📅 {new Date(item.node?.createdAt).toDateString()}
          </Text>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              setShowDetail({ show: true, selectedItem: item?.node, type: "view" })
            }
          >
            <Text style={styles.viewButtonText}>
              {capitalizeEachWord(t("view"))}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item?.node?.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          {capitalizeEachWord(t("no complaints found"))}.
        </Text>
      }
    />
  );
};

export default Display;

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  type: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3f51b5",
    textTransform: "capitalize",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  viewButton: {
    backgroundColor: "#3f51b5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 1,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});
