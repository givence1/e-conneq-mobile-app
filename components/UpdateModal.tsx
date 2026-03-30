import { playstore } from "@/utils/config";
import { InterVersion, InterVersionUpdateStatus } from "@/utils/schemas/interfaceGraphql";
import React from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type UpdateModalProps = {
  visible: boolean;
  versionChanges: InterVersion | null;
  status: InterVersionUpdateStatus | null;
  onClose?: () => void;
};

export default function UpdateModal({
  visible,
  status,
  versionChanges,
  onClose,
}: UpdateModalProps) {

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {status?.expired ? "Update Required" : "New Update Available"}
          </Text>

          <Text style={styles.version}>Version {status?.latest}</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Major Changes */}
            {versionChanges?.majorChanges && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Major Improvements</Text>
                {versionChanges?.majorChanges.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Minor Changes */}
            {versionChanges?.minorChanges && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minor Updates</Text>
                {versionChanges?.minorChanges.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <View style={styles.bulletSmall} />
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Update button */}
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => Linking.openURL(playstore)}
          >
            <Text style={styles.updateText}>Update Now</Text>
          </TouchableOpacity>

          {/* Skip only for optional updates */}
          {!status?.expired && onClose && (
            <TouchableOpacity style={styles.skipBtn} onPress={onClose}>
              <Text style={styles.skipText}>Remind Me Later</Text>
              <Text style={{ fontSize: 14, fontStyle: "italic", marginBottom: 2 }}>{(status?.daysRemaining || 0) > 0 ? "(" + status?.daysRemaining + " Days Left)" : null}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    maxHeight: "85%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  scroll: {
    maxHeight: 320,
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: "#0A84FF",
    borderRadius: 4,
    marginTop: 5,
    marginRight: 8,
  },
  bulletSmall: {
    width: 6,
    height: 6,
    backgroundColor: "#999",
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  listText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  updateBtn: {
    backgroundColor: "#0A84FF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  updateText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  skipBtn: {
    alignItems: "center",
    padding: 10,
  },
  skipText: {
    color: "#777",
    fontSize: 15,
  },
});