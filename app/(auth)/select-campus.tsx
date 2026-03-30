import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { decodeUrlID, removeEmptyFields } from "@/utils/functions";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { EdgeSchoolHigherInfo, NodeCustomUser } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export default function SelectCampusScreen(): JSX.Element {
  const router = useRouter();
  const { user, token, storeSection, storeCampusInfo } = useAuthStore();
  const { t } = useTranslation();

  const { data: dataSchools, loading } = useQuery(GET_DATA, {
    variables: { userId: user?.user_id },
  });

  const customuser = dataSchools?.allCustomusers?.edges[0]?.node;
  const mySchools = dataSchools?.allSchoolInfos?.edges?.filter(
    (sch: EdgeSchoolHigherInfo) =>
      user?.school?.includes(parseInt(decodeUrlID(sch.node.id) || ""))
  );

  const handleSelect = (item: EdgeSchoolHigherInfo, section: "higher" | "secondary" | "primary" | "vocational"): void => {

    storeSection(section)
    storeCampusInfo(item?.node)

    router.replace({
      pathname: `/(tabteacher)/${section}`,
    });
  };

  const updateRegistrationLecturer = async ({
    customuser,
  }: {
    customuser: NodeCustomUser | any;
  }) => {
    if (customuser && customuser?.role === "teacher") {
      const { id, ...restCustomUser } = customuser || {};

      const newData: any = {
        ...restCustomUser,
        language: customuser?.language || "en",
        registrationNumber: customuser?.matricle,
        firstName: customuser?.firstName?.toString().toUpperCase(),
        lastName: customuser?.lastName?.toString().toUpperCase(),
        sex: customuser?.sex?.toString().toUpperCase(),
        email: customuser?.email?.toString().toLowerCase(),
        telephone: customuser?.telephone,
        address: customuser?.address?.toString().toUpperCase() || "-",
        pob: customuser?.pob?.toString().toUpperCase() || "-",
        dob: customuser?.dob || "1980-01-01",

        nationality: customuser?.nationality,
        regionOfOrigin: customuser?.regionOfOrigin || "-",
        highestCertificate: customuser?.highestCertificate,
        yearObtained: customuser?.yearObtained,
        fatherName: customuser?.fatherName,
        motherName: customuser?.motherName,
        parentAddress: customuser?.parentAddress,
        action: "UPDATING",
        campusId: customuser?.campusId,
        status: "ADMITTED",
        admissionStatus: true,
        infoData: customuser?.infoData,

        delete: false,
      };

      try {
        const resId = await ApiFactory({
          newData: { ...removeEmptyFields(newData) },
          editData: { ...removeEmptyFields(newData) },
          mutationName: "createUpdateDeletePreinscriptionLecturer",
          modelName: "preinscriptionlecturer",
          successField: "id",
          query: mutationPreInscriptionLecturer,
          router: null,
          params: null,
          redirect: false,
          reload: false,
          returnResponseField: true,
          redirectPath: ``,
          actionLabel: "creating",
          token,
        });

        if (resId && resId?.length > 5) {
          const pId = parseInt(decodeUrlID(resId) || "");
          if (pId > 0) {
            const userData = {
              id: decodeUrlID(customuser?.id || ""),
              preinscriptionLecturerId: pId,
              infoData: customuser?.infoData,
              language: customuser?.language || JSON.stringify(["en"]),
              delete: false,
            };
            try {
              const userSuccessFieldData = await ApiFactory({
                newData: removeEmptyFields(userData),
                editData: removeEmptyFields(userData),
                mutationName: "createUpdateDeleteCustomuser",
                modelName: "customuser",
                successField: "id",
                query: mutationCustomUser,
                router,
                params: null,
                redirect: false,
                reload: false,
                returnResponseField: true,
                redirectPath: ``,
                actionLabel: "creating",
                token,
              });

              if (userSuccessFieldData.length > 5) {
                window.location.reload();
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("campus.selectCampus")}</Text>

      {loading ?
        <ActivityIndicator />
        : !user?.registration_lec_id ?
          <View>
            <Text>{t("campus.incompleteLecturerInfo")}</Text>
            <Text>{t("campus.updateProfilePrompt")}</Text>
            <TouchableOpacity
              onPress={() => updateRegistrationLecturer({ customuser })}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{t("ui.update")}</Text>
            </TouchableOpacity>
          </View> : null}

      {!loading ?
        <FlatList
          data={mySchools}
          keyExtractor={(item) => item.node.id}
          renderItem={({ item }) => {
            const section = item?.node?.schoolType === "Section-H" ? "higher" :
              item?.node?.schoolType === "Section-S" ? "secondary" :
                item?.node?.schoolType === "Section-P" ? "primary" : "vocational"
            return <TouchableOpacity
              style={[styles.card, { backgroundColor: `${section === "higher" ? "#1e3a8a" : section === "secondary" ? "#0f766e" : section === "primary" ? "#166534" : "#7e22ce"}` }]}
              onPress={() => handleSelect(item, section)}
            >
              <Text style={[styles.title, { color: "white", textAlign: "center" }]}>{item.node.schoolName}</Text>
              <Text style={[styles.text, { color: "white", textAlign: "center" }]}>
                {item.node.town} - {item.node.address}
              </Text>
              <Text style={[styles.text, { color: "white", textAlign: "center" }]}>
                {item.node.campus.replace("_", "-")}
              </Text>
            </TouchableOpacity>
          }}
          contentContainerStyle={{ paddingVertical: 20 }}
        /> : null}

    </View>
  );
}

const GET_DATA = gql`
  query GetData($userId: ID!) {
    allSchoolInfos {
      edges {
        node {
          id
          schoolName
          address
          town
          telephone
          schoolType
          campus
          caLimit examLimit
        }
      }
    }
    allCustomusers(id: $userId) {
      edges {
        node {
          id matricle role infoData
          preinscriptionLecturer {
            fullName
            firstName
            lastName
            sex
            dob
            pob
            address
            telephone
            email
            nationality
            regionOfOrigin
            highestCertificate
            yearObtained
            fatherName
            fatherTelephone
            parentAddress
          }
        }
      }
    }
  }
`;

// Add the missing query for customuser
const mutationCustomUser = gql`
  mutation CustomUser (
    $id: ID!
    $preinscriptionLecturerId: ID!
    $infoData: JSONString!
    $language: String!
    $delete: Boolean!
  ) {
    createUpdateDeleteCustomuser(
      id: $id
      preinscriptionLecturerId: $preinscriptionLecturerId
      infoData: $infoData
      language: $language
      delete: $delete
    ) {
      customuser {
        id
      }
    }
  }
`;







const mutationPreInscriptionLecturer = gql`
  mutation CreateUpdateDeletePreinscriptionLecturer (
    $id: ID
    $registrationNumber: String
    $firstName: String
    $lastName: String
    $sex: String
    $email: String
    $telephone: String
    $address: String
    $pob: String
    $dob: String
    $nationality: String
    $regionOfOrigin: String
    $highestCertificate: String
  
    $yearObtained: String
    $fatherName: String
    $motherName: String
    $parentAddress: String
    $action: String
    
    $status: String
    $admissionStatus: Boolean
    $infoData: JSONString!
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscriptionLecturer (
      id: $id
      registrationNumber: $registrationNumber
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      email: $email
      telephone: $telephone
      address: $address
      pob: $pob
      dob: $dob
      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      highestCertificate: $highestCertificate
    
      yearObtained: $yearObtained
      fatherName: $fatherName
      motherName: $motherName
      parentAddress: $parentAddress
      action: $action
      
      status: $status
      admissionStatus: $admissionStatus
      infoData: $infoData
      delete: $delete
    ) {
      preinscriptionlecturer {
        id
      }
    }
  }
`;






// Styles unchanged…



const styles = StyleSheet.create<{
  container: ViewStyle;
  header: TextStyle;
  card: ViewStyle;
  title: TextStyle;
  text: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
  },
});