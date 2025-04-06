import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

// Setting Item component
const SettingItem = ({
  icon,
  title,
  description,
  hasSwitch = false,
  hasBadge = false,
  badgeText = "",
}) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color="#333" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {hasBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
      {hasSwitch && (
        <Switch
          trackColor={{ false: "#E0E0E0", true: "#6A3DE8" }}
          thumbColor={isEnabled ? "#fff" : "#fff"}
          ios_backgroundColor="#E0E0E0"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      )}
      {!hasSwitch && !hasBadge && (
        <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <Header title="Profile" />

      {/* Profile Section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Alex Johnson</Text>
          <Text style={styles.userEmail}>alex.johnson@example.com</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon="person-outline"
              title="Personal Information"
              description="Update your personal details"
            />
            <SettingItem
              icon="card-outline"
              title="Payment Methods"
              description="Manage your payment options"
            />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              hasSwitch={true}
            />
            <SettingItem icon="lock-closed-outline" title="Privacy" />
          </View>

          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              hasSwitch={true}
            />
            <SettingItem
              icon="language-outline"
              title="Language"
              description="English (US)"
            />
            <SettingItem
              icon="cloud-download-outline"
              title="Storage"
              hasBadge={true}
              badgeText="1.2 GB"
            />
          </View>

          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.settingsContainer}>
            <SettingItem icon="help-circle-outline" title="Help & Support" />
            <SettingItem icon="information-circle-outline" title="About" />
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation - This would be provided by the _layout.tsx */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Extra space for bottom navigation
  },
  profileSection: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#6A3DE8",
    borderRadius: 25,
  },
  editButtonText: {
    color: "white",
    fontWeight: "600",
  },
  settingsSection: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
  settingsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: "#888",
    marginTop: 3,
  },
  badgeContainer: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  logoutButton: {
    padding: 15,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#F44336",
    fontWeight: "500",
  },
});
