import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { capitalizeEachWord } from "@/utils/functions";
import { useTranslation } from "react-i18next";
import { NodeComplain } from "@/utils/schemas/interfaceGraphql";
import CreateEditAnnouncement from "./CreateEditAnnouncement";
import Display from "./Display";


const Index = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const [showDetail, setShowDetail] = useState<{ show: boolean, selectedItem: NodeComplain | null, type: "create" | "view" }>({ show: false, selectedItem: null, type: "view" });

    const { data, loading, error, refetch } = useQuery(GET_DATA, {
        variables: {
            customuserId: Number(user?.user_id)
        },
        skip: !user?.user_id,
    });

    return <View style={{ flex: 1, backgroundColor: COLORS.background }}>

        <AppHeader showBack showTitle />

        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    color: "#0066cc",
                    marginVertical: 8,
                }}
            >
                {capitalizeEachWord(t("announcements"))}
            </Text>

            {
                loading ?
                    <View>
                        <ActivityIndicator />
                    </View>

                    :

                    (showDetail?.show && showDetail?.selectedItem?.id && showDetail?.selectedItem) ?
                        <CreateEditAnnouncement
                            data={showDetail.selectedItem}
                            setShowDetail={setShowDetail}
                            refetch={refetch}
                        />

                        :

                        (showDetail?.show && !showDetail?.selectedItem) ?
                            <CreateEditAnnouncement
                                data={showDetail.selectedItem}
                                setShowDetail={setShowDetail}
                                refetch={refetch}
                            />

                            :

                            
                            (showDetail?.type === "view") ?
                                <View>
                                    <TouchableOpacity
                                        onPress={() => setShowDetail({ show: true, type: "create", selectedItem: null })}
                                    >
                                        <Text>+</Text>
                                    </TouchableOpacity>
                                    <Display
                                        data={data?.allComplains?.edges}
                                        setShowDetail={setShowDetail}
                                    />
                                </View>

                                :

                                null
            }


        </ScrollView>
    </View>
}

export default Index


const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 90, // space for TabsHeader
    },
});


const GET_DATA = gql`
query GetStudentCourses  {
    allComplains  {
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
}`;
