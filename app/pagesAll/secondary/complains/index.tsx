import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeEachWord } from "@/utils/functions";
import { NodeComplain } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CreateEditComplain from "./CreateEditComplains";
import Display from "./Display";

const Index = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [showDetail, setShowDetail] = useState<{
    show: boolean;
    selectedItem: NodeComplain | null;
    type: "create" | "view";
  }>({ show: false, selectedItem: null, type: "view" });

  const { data, loading, refetch } = useQuery(GET_DATA, {
    variables: { customuserId: Number(user?.user_id) },
    skip: !user?.user_id,
  });

  // ✅ Show newest complaints first
  const sortedData = useMemo(() => {
    if (!data?.allComplains?.edges) return [];
    return [...data.allComplains.edges].sort(
      (a, b) =>
        new Date(b.node.createdAt).getTime() -
        new Date(a.node.createdAt).getTime()
    );
  }, [data]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTitle />

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>
          {capitalizeEachWord(t("complains"))}
        </Text>

        {/* Loading */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        ) : showDetail.show ? (
          <CreateEditComplain
            data={showDetail.selectedItem}
            setShowDetail={setShowDetail}
            refetch={refetch}
            readOnly={showDetail.type === "view"} // ✅ new prop
          />
        ) : (
          <Display data={sortedData} setShowDetail={setShowDetail} />
        )}
      </View>

      {/* Buttons fixed near bottom */}
      {showDetail.show ? (
        <TouchableOpacity
          style={styles.floatingButtonBack}
          onPress={() =>
            setShowDetail({ show: false, type: "view", selectedItem: null })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.floatingButtonAdd}
          onPress={() =>
            setShowDetail({ show: true, type: "create", selectedItem: null })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80,
    paddingTop: 100,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#0066cc",
    marginBottom: 25,
  },
  floatingButtonBack: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "#af4c5cff",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  floatingButtonAdd: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
});

const GET_DATA = gql`
  query GetData($customuserId: Decimal!) {
    allComplains(customuserId: $customuserId) {
      edges {
        node {
          id
          complainType
          createdAt
          status
          response
          updatedAt
          message
        }
      }
    }
  }
`;
