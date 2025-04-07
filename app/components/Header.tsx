import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Simu.ai" }: HeaderProps) => {
  const handleProPress = () => {
    router.push("/pro");
  };

  return (
    <View style={styles.header}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <TouchableOpacity
        style={styles.proButton}
        onPress={handleProPress}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.proButtonText}>PRO</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    height: 30,
    width: 100,
    resizeMode: "contain",
  },
  proButton: {
    borderRadius: 10,
  },
  buttonContainer: {
    backgroundColor: "#003aff", // Medium slate blue - close to the purple in the image
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#9969FF",
  },
  proButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default Header;
