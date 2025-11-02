import { capitalizeEachWord } from "@/utils/functions";
import React from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MyTabProps {
    value: string; // currently selected value
    onChange: (val: string | any) => void; // callback
    tabs: string[]; // tab labels
    activeColor?: string;
    inactiveColor?: string;
    backgroundColor?: string;
    fontSize?: number;
    animated?: boolean; // enable simple animation
}

const MyTab: React.FC<MyTabProps> = ({
    value,
    onChange,
    tabs,
    activeColor = "#0066cc",
    inactiveColor = "#666",
    backgroundColor = "#f4f4f4",
    fontSize = 16,
    animated = true,
}) => {

    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const { t } = useTranslation();

    const handlePress = (tab: string) => {
        if (animated) {
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start();
        }
        onChange(tab);
    };

    return (
        <View style={[styles.tabContainer, { backgroundColor }]}>
            <Animated.View style={[styles.tabWrapper, { opacity: fadeAnim }]}>
                {tabs.map((tab) => {
                    const isActive = tab === value;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => handlePress(tab)}
                            style={[styles.tabItem, isActive && { backgroundColor: activeColor }]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    { color: isActive ? "#fff" : inactiveColor, fontSize },
                                ]}
                            >
                                {capitalizeEachWord(t(tab))}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </Animated.View>
        </View>
    );
};

export default MyTab;

const styles = StyleSheet.create({
  tabContainer: {
    marginVertical: 6,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 4,
    gap: 6,
  },
  tabItem: {
    flex: 1, // ensures equal width for each tab
    justifyContent: "center", // centers content vertically
    alignItems: "center", // centers text horizontally
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e9e9e9",
  },
  tabText: {
    fontWeight: "500",
    textAlign: "center",
  },
});