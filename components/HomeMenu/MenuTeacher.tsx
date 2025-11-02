import COLORS from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";


type MenuSection = {
    label: string;
    route: string;
    icon: any;
    display: boolean;
};

export const MenuTeacher = (
    { role, section }:
        { role: "admin" | "teacher", section: "higher" | "secondary" | "primary" | "vocational" | null }
): MenuSection[] => {
    const { t } = useTranslation();

    return [

        // HIGHER SECTION
        {
            label: t("ui.markupload"),
            route: "/pagesAll/higher/markupload",
            icon: <Feather
                name="credit-card"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },
        {
            label: t("ui.mytimetable"),
            route: "/pagesAll/higher/mytimetablelecturer",
            icon: <Feather
                name="credit-card"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },
        // {
        //     label: t("ui.myattendance"),
        //     route: "/pagesAll/higher/attendance",
        //     icon: <Feather
        //         name="credit-card"
        //         size={24}
        //         color={COLORS.primary}
        //     />,
        //     display: (role === "admin" || role === "teacher") && (section === "higher")
        // },
        {
            label: t("ui.myavailability"),
            route: "/pagesAll/higher/availability",
            icon: <Feather
                name="credit-card"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },
        {
            label: t("ui.mymaterial"),
            route: "/pagesAll/higher/material",
            icon: <Feather
                name="credit-card"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },
        // {
        //     label: t("ui.questions"),
        //     route: "/pagesAll/quiz/LecturerQuestionSubmission",
        //     icon: <Feather
        //         name="credit-card"
        //         size={24}
        //         color={COLORS.primary}
        //     />,
        //     display: (role === "admin" || role === "teacher") && (section === "higher")
        // },
        {
            label: t("ui.announcements"),
            route: "/pagesAll/higher/announcements",
            icon: <Feather
                name="credit-card"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },
        {
            label: t("ui.complains"),
            route: "/pagesAll/higher/complains",
            icon: <Ionicons
                name="alert-circle-outline"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },
        {
            label: t("studentHome.more"),
            route: "/pagesAll/higher/more",
            icon: <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "higher")
        },






        // SECONDARY SECTION
        {
            label: t("ui.subjects"),
            route: "/pagesAll/subject/subjectsec",
            icon: <Feather
                name="credit-card"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "secondary")
        },
        {
            label: t("ui.more"),
            route: "/pagesAll/results/more",
            icon: <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={COLORS.primary}
            />,
            display: (role === "admin" || role === "teacher") && (section === "secondary")
        },
    ]
}