import COLORS from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

/**
 * A helper component to show any icon with an optional notification dot.
 */
const IconWithNotification = ({
  icon,
  showDot,
}: {
  icon: JSX.Element;
  showDot?: boolean;
}) => {
  return (
    <View style={{ position: "relative" }}>
      {icon}
      {showDot && (
        <View
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: "green",
          }}
        />
      )}
    </View>
  );
};

type MenuSection = {
  label: string;
  route: string;
  icon: any;
  display: boolean;
};

type NotificationType = {
  material?: boolean;
  announcement?: boolean;
  complaint?: boolean;
  timetable?: boolean;
};

/**
 * Main Menu configuration for teacher/admin.
 */
export const MenuTeacher = (
  {
    role,
    section,
    newNotifications,
  }: {
    role: "admin" | "teacher";
    section: "higher" | "secondary" | "primary" | "vocational" | null;
    newNotifications?: NotificationType;
  }
): MenuSection[] => {
  const { t } = useTranslation();

  return [
    // AVAILABILITY — no notifications
    {
      label: t("ui.availibility"),
      route: "/pagesAll/attendance/availability",
      icon: (
        <Feather name="credit-card" size={24} color={COLORS.primary} />
      ),
      display:
        (role === "admin" || role === "teacher") && section === "higher",
    },

    // MATERIALS — show notification if new material is uploaded
    {
      label: t("ui.materials"),
      route: "/pagesAll/quiz/LecturerQuestionSubmission",
      icon: (
        <IconWithNotification
          icon={<Feather name="book" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.material}
        />
      ),
      display:
        (role === "admin" || role === "teacher") && section === "higher",
    },

    // ANNOUNCEMENTS — show notification dot
    {
      label: t("ui.announcements"),
      route: "/pagesAll/announcements/announcements",
      icon: (
        <IconWithNotification
          icon={<Feather name="bell" size={24} color={COLORS.primary} />}
          showDot={!!newNotifications?.announcement}
        />
      ),
      display:
        (role === "admin" || role === "teacher") && section === "higher",
    },

    // COMPLAINTS — show notification dot if new complaint
    {
      label: t("ui.complaints"),
      route: "/pagesAll/profile/complaint",
      icon: (
        <IconWithNotification
          icon={
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          }
          showDot={!!newNotifications?.complaint}
        />
      ),
      display:
        (role === "admin" || role === "teacher") && section === "higher",
    },

    // TIMETABLE — show notification dot if new timetable uploaded
    {
      label: t("ui.timetable"),
      route: "/pagesAll/profile/lecturerTimeTable",
      icon: (
        <IconWithNotification
          icon={
            <Ionicons
              name="calendar-outline"
              size={24}
              color={COLORS.primary}
            />
          }
          showDot={!!newNotifications?.timetable}
        />
      ),
      display:
        (role === "admin" || role === "teacher") && section === "higher",
    },

    // SECONDARY SECTION
    {
      label: t("ui.more"),
      route: "/pagesAll/results/more",
      icon: (
        <Ionicons
          name="ellipsis-horizontal"
          size={24}
          color={COLORS.primary}
        />
      ),
      display:
        (role === "admin" || role === "teacher") && section === "secondary",
    },
  ];
};
