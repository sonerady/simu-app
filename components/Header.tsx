import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  showBackButton?: boolean;
}

export default function Header({
  title,
  onBackPress,
  rightElement,
  showBackButton = true,
}: HeaderProps) {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="close" size={28} color="#999" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {rightElement ? rightElement : <View style={{ width: 40 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
});
