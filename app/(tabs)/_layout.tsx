import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

// NavIcon component for bottom navigation
interface NavIconProps {
  name: string;
  size: number;
  color: string;
}

const NavIcon = ({ name, size, color }: NavIconProps) => {
  switch (name) {
    case "home":
      return <Ionicons name="home" size={size} color={color} />;
    case "gallery":
      return <Ionicons name="grid-outline" size={size} color={color} />;
    case "pro":
      return <Ionicons name="sparkles-outline" size={size} color={color} />;
    case "profile":
      return <Ionicons name="person-outline" size={size} color={color} />;
    default:
      return <Ionicons name="ellipse" size={size} color={color} />;
  }
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // Hide default tab bar since we're using our custom one
      }}
      tabBar={(props) => {
        // Pro ve upload sayfasında bottom bar'ı gösterme
        if (
          props.state.routes[props.state.index].name === "pro" ||
          props.state.routes[props.state.index].name === "upload" ||
          props.state.routes[props.state.index].name === "generate"
        ) {
          return null;
        }

        return (
          <View style={styles.bottomNavWrapper}>
            <View style={styles.bottomNavContainer}>
              <BlurView intensity={30} style={styles.bottomNavBlur}>
                <View style={styles.bottomNav}>
                  {/* Sadece ilk 4 route'u göster */}
                  {props.state.routes.slice(0, 4).map((route, index) => {
                    const isFocused = props.state.index === index;
                    const onPress = () => {
                      const event = props.navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                      });

                      if (!isFocused && !event.defaultPrevented) {
                        props.navigation.navigate(route.name);
                      }
                    };

                    // Route name to icon name mapping
                    let iconName;
                    switch (route.name) {
                      case "index":
                        iconName = "home";
                        break;
                      case "gallery":
                        iconName = "gallery";
                        break;
                      case "pro":
                        iconName = "pro";
                        break;
                      case "profile":
                        iconName = "profile";
                        break;
                      default:
                        iconName = "home";
                    }

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.navItem}
                        onPress={onPress}
                      >
                        <View
                          style={[
                            styles.navIconContainer,
                            isFocused && styles.activeNavIconContainer,
                          ]}
                        >
                          <NavIcon
                            name={iconName}
                            size={22}
                            color={isFocused ? "#fff" : "#6e6e6e"}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </BlurView>
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="gallery" options={{ headerShown: false }} />
      <Tabs.Screen name="pro" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
      <Tabs.Screen name="upload" options={{ headerShown: false }} />
      <Tabs.Screen name="generate" options={{ headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  bottomNavContainer: {
    borderRadius: 40,
    overflow: "hidden",
  },
  bottomNavBlur: {
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.4)",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    paddingHorizontal: 15,
    backgroundColor: "rgba(240, 240, 240, 0.6)",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeNavIconContainer: {
    backgroundColor: "#000",
  },
});
