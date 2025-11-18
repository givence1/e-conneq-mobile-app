// components/Card.tsx
import React from "react";
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface CardProps {
  title: string;
  subtitle?: string;
  footer?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: object;
}

const Card: React.FC<CardProps> = ({ title, subtitle, footer, onPress, style }) => {
  const Content = (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3200e8ff",
    borderRadius: 5,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    // Android shadow
    elevation: 3,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  footer: {
    fontSize: 12,
    color: "#666",
  },
});

export default Card;
