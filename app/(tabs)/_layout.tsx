import { Tabs } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
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

// Tab component that can safely use hooks
const AnimatedTab = ({ route, isFocused, onPress }: any) => {
  // Animation values
  const animatedWidth = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  // Run animation when focus changes
  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 100,
    }).start();
  }, [isFocused]);

  // Route name to icon name mapping
  let iconName;
  let tabLabel;
  switch (route.name) {
    case "index":
      iconName = "home";
      tabLabel = "Home";
      break;
    case "gallery":
      iconName = "gallery";
      tabLabel = "Gallery";
      break;
    case "profile":
      iconName = "profile";
      tabLabel = "Profile";
      break;
    default:
      iconName = "home";
      tabLabel = "Home";
  }

  // Calculate animated styles
  const containerStyle = {
    width: animatedWidth.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 110],
    }),
    backgroundColor: animatedWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "#003aff"],
    }),
    paddingHorizontal: animatedWidth.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 16],
    }),
  };

  const labelStyle = {
    opacity: animatedWidth,
    marginLeft: animatedWidth.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
  };

  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Animated.View style={[styles.navIconContainer, containerStyle]}>
        <NavIcon
          name={iconName}
          size={22}
          color={isFocused ? "#fff" : "#6e6e6e"}
        />
        <Animated.Text style={[styles.tabLabel, labelStyle]}>
          {tabLabel}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // Hide default tab bar since we're using our custom one
      }}
      tabBar={(props: any) => {
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
                  {/* Filter out the pro tab and show only home, gallery and profile */}
                  {props.state.routes
                    .filter((route: any) => route.name !== "pro")
                    .slice(0, 3)
                    .map((route: any, index: any) => {
                      // Check if this route is focused by name instead of index
                      const isFocused =
                        props.state.routes[props.state.index].name ===
                        route.name;

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

                      return (
                        <AnimatedTab
                          key={index}
                          route={route}
                          isFocused={isFocused}
                          onPress={onPress}
                        />
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
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tabLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
