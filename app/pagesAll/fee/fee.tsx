// Fees.tsx
import AppHeader from "@/components/AppHeader";
import ModalActivation from "@/components/ModalActivation";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { NodeSchoolFeesPrim } from "@/utils/schemas/interfaceGraphqlPrimary";
import { NodeSchoolFeesSec } from "@/utils/schemas/interfaceGraphqlSecondary";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CardInfo from "./CardInfo";
import ModalMoratorium from "./ModalMoratorium";


const Fees = () => {
  const { t } = useTranslation();
  const { profileId, section } = useAuthStore();

  const variables: any =
    section === "higher"
      ? [{ userprofileId: profileId }, GET_DATA]
      : section === "secondary"
        ? [{ userprofilesecId: profileId }, GET_DATA_SEC]
        : section === "primary"
          ? [{ userprofileprimId: profileId }, GET_DATA]
          : section === "vocational"
            ? [{ userprofilevocId: profileId }, GET_DATA]
            : [{}, {}];

  const { data: dataFees, loading, refetch } = useQuery(variables[1], {
    variables: variables[0],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [fees, setFees] = useState<
    NodeSchoolFees | NodeSchoolFeesSec | NodeSchoolFeesPrim | any
  >();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (dataFees?.allSchoolFees?.edges?.length || dataFees?.allSchoolFeesSec?.edges?.length || dataFees?.allSchoolFeesPrim?.edges?.length) {
      const f = dataFees?.allSchoolFees?.edges[0] || dataFees?.allSchoolFeesSec?.edges[0] || dataFees?.allSchoolFeesPrim?.edges[0];
      setFees(f?.node);
    }
  }, [dataFees]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  
  const tuition =
    ((fees?.userprofile?.specialty?.tuition ||
      fees?.userprofilesec?.classroomsec?.tuition ||
      fees?.userprofileprim?.classroomprim?.tuition) ?? 0);

  const totalPaid = tuition - (fees?.balance ?? 0);

  const progress = tuition
    ? (totalPaid / tuition) * 100
    : 0;
    
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTitle />

      <View style={{ flex: 1 }}>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : fees?.id ? (
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 60,
              paddingTop: 100,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Student Info Card */}
            <CardInfo
              fees={fees}
              progress={progress}
              totalPaid={totalPaid}
            />

            {/* Transactions */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t("fees.transactions")}</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.bold, { flex: 2 }]}>
                  {t("fees.txId")}
                </Text>
                <Text style={[styles.cell, styles.bold, { flex: 2 }]}>
                  {t("fees.reason")}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.bold,
                    { flex: 1, textAlign: "right" },
                  ]}
                >
                  {t("fees.amount")}
                </Text>
              </View>

              {fees?.transactions?.map((trans: any) => (
                <View key={trans.id} style={styles.tableRow}>
                  <Text style={[styles.cell, { flex: 2 }]}>{trans.ref}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{trans.reason}</Text>
                  <Text style={[styles.cell, { flex: 1, textAlign: "right" }]}>
                    {trans.amount.toLocaleString()} F
                  </Text>
                </View>
              ))}
            </View>

            {/* Totals & Balance */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.totalPaid")}:</Text>
                <Text style={styles.value}>{totalPaid.toLocaleString()} F</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.balance")}:</Text>
                <Text style={styles.value}>{fees?.balance.toLocaleString()} F</Text>
              </View>
            </View>

            {/* Moratorium */}
            <View style={styles.card}>
              {!fees?.moratoire?.id ? (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.moratoriumButton}
                >
                  <Text style={styles.buttonText}>
                    {t("fees.requestMoratorium")}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                  <Text style={{ color: "black" }}>{t("fees.moratorium")}:</Text>
                  <Text style={[styles.badge, { backgroundColor: "green" }]}>
                    {fees?.moratoire?.status}
                  </Text>
                </View>
              )}
            </View>

            {/* Payment */}
            <View style={styles.card}>
              {!fees?.platformPaid ? (
                <TouchableOpacity
                  onPress={() => setPaymentModalVisible(true)}
                  style={styles.moratoriumButton}
                >
                  <Text style={styles.buttonText}>
                    {t("fees.activateAccount")}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="checkmark-circle" size={20} color="green" />
                  <Text style={{ color: "green", fontWeight: "600" }}>
                    {t("fees.accountActivated")}
                  </Text>
                </View>
              )}
            </View>

            {/* Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t("fees.idCard")}:</Text>
                {fees?.idPaid ? (
                  <Ionicons name="checkmark-circle" size={22} color="green" />
                ) : (
                  <Ionicons name="close-circle" size={22} color="red" />
                )}
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t("fees.accountStatus")}:</Text>
                {fees?.platformPaid ? (
                  <Ionicons name="checkmark-circle" size={22} color="green" />
                ) : (
                  <Ionicons name="close-circle" size={22} color="red" />
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            {t("fees.noInfo")}
          </Text>
        )}

        {/* Moratorium Modal */}
        {fees ? (
          <ModalMoratorium
            refetch={refetch}
            fees={fees}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        ) : null}

        {/* Payment Modal */}
        {fees ? (
          <ModalActivation
            refetch={refetch}
            fees={fees}
            modalVisible={paymentModalVisible}
            setModalVisible={setPaymentModalVisible}
          />
        ) : null}
      </View>
    </View>
  );
};

export default Fees;


// --- STYLES ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  subTitle: { fontSize: 16, color: COLORS.textPrimary, marginBottom: 2 },
  caption: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.textDark,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, fontWeight: "500", color: COLORS.textPrimary },
  value: { fontSize: 14, color: COLORS.textDark },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  bold: { fontWeight: "bold", color: "white" },
  moratoriumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: { color: "white", marginRight: 6, fontWeight: "600" },
  badge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: "600",
  },
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    padding: 12,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusLabel: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "500" },
});

// sql query

const GET_DATA = gql`
  query GetData($userprofileId: Decimal!) {
    allSchoolFees(userprofileId: $userprofileId) {
      edges {
        node {
          id balance
          userprofile {
            customuser {
              id matricle
              preinscriptionStudent { fullName }
            }
            specialty {
              id academicYear
              mainSpecialty { specialtyName }
              level { level }
              registration tuition paymentOne paymentTwo paymentThree
            }
          }
          platformPaid idPaid
          transactions {
            id amount reason ref createdAt
          }
          moratoire { id reason status
            requestedSchedule { amount dueDate }
            approvedSchedule { amount dueDate }
          }
        }
      }
    }
  }
`;

const GET_DATA_SEC = gql`
  query GetDataSec($userprofilesecId: Decimal!) {
    allSchoolFeesSec(userprofilesecId: $userprofilesecId) {
      edges {
        node {
          id balance
          userprofilesec {
            customuser {
              id matricle
              preinscriptionStudent { fullName }
            }
            classroomsec {
              id academicYear
              level classType
              series { name }
              registration tuition paymentOne paymentTwo paymentThree
            }
          }
          platformPaid idPaid
          transactionssec {
            id amount reason ref createdAt
          }
          moratoire { id reason status
            requestedSchedule { amount dueDate }
            approvedSchedule { amount dueDate }
          }
        }
      }
    }
  }
`;