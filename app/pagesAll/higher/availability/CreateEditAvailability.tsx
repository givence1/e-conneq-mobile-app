import { useAuthStore } from "@/store/authStore";
import {
  capitalizeEachWord,
  capitalizeFirstLetter,
  decodeUrlID,
  getISOWeek,
} from "@/utils/functions";
import { JwtPayload } from "@/utils/interfaces";
import { NodeLecturerAvailability } from "@/utils/schemas/interfaceGraphql";
import { gql, useMutation } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Action from "./Action";

interface Slot {
  start: string;
  end: string;
}

const CreateEditAvailability = ({
  data,
  dataAllWeeks,
  weeks,
  refetch,
  setSelected,
}: {
  data: NodeLecturerAvailability | null;
  dataAllWeeks: NodeLecturerAvailability | null;
  weeks: string[] | null;
  refetch: any;
  setSelected: any;
}) => {
  const { t } = useTranslation("common");
  const { token } = useAuthStore();
  const user: JwtPayload = jwtDecode(token || "");

  const [submitting, setSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [dataToSubmitOld, setDataToSubmitOld] = useState<any>();
  const [dataToSubmit, setDataToSubmit] = useState<any>();

  const isEditing = (data?.id?.length) || (data?.month === new Date().getMonth() + 1);

  const intVal = () => {
    const slot = data?.availabilitySlots[0]?.slots[0];
    if (!slot) return 2;
    const [startHour, startMin] = slot.start.split(":").map(Number);
    const [endHour, endMin] = slot.end.split(":").map(Number);
    return endHour + endMin / 60 - (startHour + startMin / 60);
  };

  const [formData, setFormData] = useState({
    weekNo: weeks?.length ? getISOWeek(new Date(weeks[0])) : getISOWeek(new Date()),
    interval: intVal() || 2,
  });

  useEffect(() => {
    if (data) {
      setDataToSubmitOld(convertToFrontendFormat(data?.availabilitySlots));
      setDataToSubmit(convertToFrontendFormat(data?.availabilitySlots));
    }
  }, [data]);

  useEffect(() => {
    if (data?.id) setShowSettings(false);
  }, [formData]);

  const [createUpdateAvailability] = useMutation(CREATE_UPDATE_AVAILABILITY);

  const onSubmit = async () => {
    let newDataToSubmit: Record<string, { start: string; end: string }[]> = {};

    if (data && isEditing) {
      newDataToSubmit = dataToSubmit;
    } else {
      newDataToSubmit = {
        ...dataToSubmit,
        ...dataAllWeeks?.availabilitySlots?.reduce(
          (acc, { date, slots }) => ({
            ...acc,
            [date]: slots,
          }),
          {} as Record<string, { start: string; end: string }[]>
        ),
      };
    }

    const variables = {
      id: isEditing
        ? decodeUrlID(data?.id || "")
        : dataAllWeeks?.id
        ? decodeUrlID(dataAllWeeks?.id)
        : null,
      customuserId: user?.user_id,
      year: new Date().getFullYear(),
      month: isEditing
        ? data?.month
        : dataAllWeeks?.month
        ? dataAllWeeks?.month
        : new Date().getMonth() + 1,
      availabilitySlots: JSON.stringify(convertToBackendFormat({ ...newDataToSubmit })),
      createdById: data?.createdBy
        ? decodeUrlID(data?.createdBy?.id)
        : dataAllWeeks?.createdBy?.id
        ? decodeUrlID(dataAllWeeks?.createdBy?.id)
        : user?.user_id,
      updatedById: user?.user_id,
      delete: false,
    };

    try {
      setSubmitting(true);
      const res = await createUpdateAvailability({ variables });
      if (res?.data?.createUpdateDeleteLecturerAvailability?.lectureravailability?.id) {
        refetch();
        alert("✅ Operation successful");
        setDataToSubmitOld({});
        setDataToSubmit({});
        setShowSettings(true);
        setSelected({ weekRange: null, display: null });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (submitting) {
      return (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      );
    }

    return (
      <Action
        formData={formData}
        setShowSettings={setShowSettings}
        dataToSubmit={dataToSubmit}
        dataToSubmitOld={dataToSubmitOld}
        setDataToSubmit={setDataToSubmit}
      />
    );
  };

  return (
    <FlatList
      data={[1]} // dummy single-item list for safe scrolling container
      renderItem={() => (
        <View style={styles.container}>
          <Text style={styles.title}>
            {t("select your available period").toUpperCase()}
          </Text>

          {showSettings ? (
            <SettingComp formData={formData} setFormData={setFormData} t={t} />
          ) : (
            <View style={styles.buttonsRow}>
              <Button title="TIME INTERVAL" onPress={() => setShowSettings(true)} />
              {dataToSubmit && (
                <Button
                  title={
                    isEditing
                      ? capitalizeEachWord(t("edit"))
                      : capitalizeEachWord(t("submit"))
                  }
                  onPress={onSubmit}
                />
              )}
            </View>
          )}

          {renderContent()}
        </View>
      )}
    />
  );
};

export default CreateEditAvailability;

/* ------------------- Supporting Components ------------------- */

const SettingComp = ({ t, formData, setFormData }: any) => (
  <View style={styles.settingsContainer}>
    <View style={styles.pickerContainer}>
      <Text style={{ marginBottom: 4 }}>
        {capitalizeFirstLetter(t("interval"))}:
      </Text>
      <Picker
        selectedValue={formData.interval}
        onValueChange={(value) => setFormData({ ...formData, interval: value })}
        style={{ height: 50, width: "100%" }}
      >
        {(formData.interval > 2 ? [formData.interval] : [2, 4]).map(
          (i: number, idx: number) => (
            <Picker.Item
              key={idx}
              label={`${i}H - ${capitalizeFirstLetter(t("interval"))}`}
              value={i}
            />
          )
        )}
      </Picker>
    </View>
  </View>
);

/* ------------------- Utility Functions ------------------- */

function convertToFrontendFormat(
  data: { date: string; slots: { start: string; end: string }[] }[]
): Record<string, Slot[]> {
  const result: Record<string, Slot[]> = {};
  data.forEach((item) => {
    result[item.date] = item.slots.map(({ start, end }) => ({ start, end }));
  });
  return result;
}

function convertToBackendFormat(data: Record<string, Slot[]>) {
  return Object.entries(data)
    .filter(([_, slots]) => slots.length > 0)
    .map(([date, slots]) => ({ date, slots }));
}

/* ------------------- GraphQL ------------------- */

const CREATE_UPDATE_AVAILABILITY = gql`
  mutation Data(
    $id: ID
    $customuserId: ID
    $year: Int!
    $month: Int!
    $availabilitySlots: JSONString!
    $updatedById: ID!
    $createdById: ID!
    $delete: Boolean!
  ) {
    createUpdateDeleteLecturerAvailability(
      id: $id
      customuserId: $customuserId
      year: $year
      month: $month
      availabilitySlots: $availabilitySlots
      createdById: $createdById
      updatedById: $updatedById
      delete: $delete
    ) {
      lectureravailability {
        id
      }
    }
  }
`;

/* ------------------- Styles ------------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
  },
  settingsContainer: {
    width: "100%",
    padding: 16,
    gap: 12,
  },
  pickerContainer: {
    width: "100%",
  },
});
