import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { NodeDocumentApplications } from "@/utils/schemas/interfaceGraphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



export default function TranscriptScreen() {
  const { t } = useTranslation();
  const { profileId, user } = useAuthStore();
  console.log(user);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingTranscriptBtn, setLoadingTranscriptBtn] = useState(false);
  const [loadingAttestationBtn, setLoadingAttestationBtn] = useState(false);


  // Fetch current transcript application (if any)
  const { data: dataTranscript, loading, refetch } = useQuery(GET_DOCUMENT, {
    variables: {
      userprofileId: profileId,
      document: "TRANSCRIPT",
    },
    skip: !profileId,
    fetchPolicy: "network-only",
  });
  
  const { data: dataAttestation, loading: loadingAttestation, refetch: refreshAttestation } = useQuery(GET_DOCUMENT, {
    variables: {
      userprofileId: profileId,
      document: "SCHOOL ATTESTATION",
    },
    skip: !profileId,
    fetchPolicy: "network-only",
  });

  const docTranscript: NodeDocumentApplications | null = dataTranscript?.allDocumentApplications?.edges?.[0]?.node || null;
  const docAttestation: NodeDocumentApplications | null = dataAttestation?.allDocumentApplications?.edges?.[0]?.node || null;

  const [applyDocument, { loading: applying }] = useMutation(APPLY_DOCUMENT, {
    onCompleted: () => {
      Alert.alert(t("transcript.submitted"), t("transcript.submittedMessage"));
      refetch();
    },
    onError: (err) => {
      console.error(err);
      Alert.alert(t("ui.error"), t("ui.serverError"));
    },
  });

  const handleDocumentApply = async (document: "TRANSCRIPT" | "SCHOOL ATTESTATION") => {
  try {
    if (document === "TRANSCRIPT") {
      if (docTranscript && docTranscript.status === "PENDING") return;
      setLoadingTranscriptBtn(true);
    } else {
      if (docAttestation && docAttestation.status === "PENDING") return;
      setLoadingAttestationBtn(true);
    }

    await applyDocument({
      variables: {
        userprofileId: profileId,
        document,
        delete: false,
        updatedById: user?.user_id,
        createdById: user?.user_id,
        status: "PENDING",
      }
    });
  } catch (e) {
    console.log(e);
  } finally {
    setLoadingTranscriptBtn(false);
    setLoadingAttestationBtn(false);
  }
};

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const isPendingTranscript = docTranscript?.status === "PENDING";
  const isPendingAttestation = docAttestation?.status === "PENDING";
  const isApprovedTranscript = docTranscript?.status === "APPROVED";
  const isApprovedAttestation = docAttestation?.status === "APPROVED";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header fixed at top */}
      <AppHeader showBack showTitle />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >

        {/* Transcript Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("transcript.title")}</Text>
          <Text style={styles.cardDescription}>{t("transcript.description")}</Text>

          {docTranscript ? (
            <View style={{ marginVertical: 12 }}>
              <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>
                {t("transcript.status")}:{" "}
                <Text
                  style={{
                    color: isPendingTranscript ? "orange" : isApprovedTranscript ? "green" : COLORS.textSecondary,
                  }}
                >
                  {docTranscript.status}
                </Text>
              </Text>
              {docTranscript.approvedAt && (
                <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>
                  {t("transcript.approvedAt")}: {new Date(docTranscript.approvedAt).toLocaleString()}
                </Text>
              )}
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isPendingTranscript ? COLORS.textSecondary : COLORS.primary },
            ]}
            onPress={() => handleDocumentApply("TRANSCRIPT")}
            disabled={isPendingTranscript || loadingTranscriptBtn}
          >
            {loadingTranscriptBtn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.buttonText, { color: "#fff" }]}>
                {isPendingTranscript ? t("transcript.pending") : t("transcript.apply")}
              </Text>
            )}
          </TouchableOpacity>

        </View>

        {/* Attestation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("attestation.title")}</Text>
          <Text style={styles.cardDescription}>{t("attestation.description")}</Text>

          {docAttestation ? (
            <View style={{ marginVertical: 12 }}>
              <Text style={{ fontWeight: "600", color: COLORS.textPrimary }}>
                {t("attestation.status")}:{" "}
                <Text
                  style={{
                    color: isPendingAttestation ? "orange" : isApprovedAttestation ? "green" : COLORS.textSecondary,
                  }}
                >
                  {docAttestation.status}
                </Text>
              </Text>
              {docAttestation.approvedAt && (
                <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>
                  {t("attestation.approvedAt")}: {new Date(docAttestation.approvedAt).toLocaleString()}
                </Text>
              )}
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isPendingAttestation ? COLORS.textSecondary : COLORS.primary },
            ]}
            onPress={() => handleDocumentApply("SCHOOL ATTESTATION")}
            disabled={isPendingAttestation || loadingAttestationBtn}
          >
            {loadingAttestationBtn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.buttonText, { color: "#fff" }]}>
                {isPendingAttestation ? t("attestation.pending") : t("attestation.apply")}
              </Text>
            )}
          </TouchableOpacity>

        </View>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

// GraphQL
const GET_DOCUMENT = gql`
  query AllDocumentApplications(
    $userprofileId: Decimal!
    $document: String!
  ) {
    allDocumentApplications(
      userprofileId: $userprofileId
      document: $document
    ) {
      edges {
        node {
          id
          status
          approvedAt
        }
      }
    }
  }
`;

const APPLY_DOCUMENT = gql`
  mutation ApplyDocument(
    $userprofileId: ID!
    $document: String!
    $createdById: ID!
    $updatedById: ID!
    $status: String!
    $delete: Boolean!
  ) {
    createUpdateDeleteDocumentApplication(
      userprofileId: $userprofileId
      document: $document
      createdById: $createdById
      updatedById: $updatedById
      status: $status
      delete: $delete
    ) {
      documentapplication {
        id
      }
    }
  }
`;