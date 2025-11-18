import { capitalizeEachWord } from "@/utils/functions";
import { EdgeComplain } from "@/utils/schemas/interfaceGraphql";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  data: EdgeComplain[];
  setShowDetail: any;
}

const MAX_LENGTH = 120;

// 🔹 A separate component for each complaint card
interface ComplainItemProps {
  item: EdgeComplain;
  setShowDetail: (data: { show: boolean; selectedItem: any; type: string }) => void;
}

const ComplainItem: React.FC<ComplainItemProps> = ({ item, setShowDetail }) => {
  const [expanded, setExpanded] = useState(false);
  const { node } = item;
  const statusText = node.status ? "Resolved" : "Pending";
  const statusColor = node.status ? "#4CAF50" : "#b61307ff";
  const message = node?.message || "";
  const isLong = message.length > MAX_LENGTH;
  const displayText = expanded ? message : message.slice(0, MAX_LENGTH);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.type}>{node?.complainType?.toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      {/* Message */}
      <Text style={styles.message}>{displayText}</Text>

      {/* Show more / less */}
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.showMoreText}>
            {expanded ? "Show Less ▲" : "Show More ▼"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.date}>📅 {new Date(node?.createdAt).toDateString()}</Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            setShowDetail({ show: true, selectedItem: node, type: "view" })
          }
        >
          <Text style={styles.viewButtonText}>
            {capitalizeEachWord("view")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 🔹 Main Display component
const Display: React.FC<Props> = ({ data, setShowDetail }) => {
  const { t } = useTranslation();

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <ComplainItem item={item} setShowDetail={setShowDetail} />
      )}
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
    lineHeight: 18,
  },
  showMoreText: {
    color: "#3f51b5",
    fontWeight: "600",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
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
