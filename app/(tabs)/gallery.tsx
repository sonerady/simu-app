import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Header from "../components/Header";

// Get screen width to calculate columns
const { width } = Dimensions.get("window");
const numColumns = 3;
const tileSize = width / numColumns - 12;

export default function GalleryScreen() {
  // Sample gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1614849963640-9cc74b2a385b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1586672806791-3a67d24186c0?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1578255321055-68b5bc99052b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1617791160588-241658c0f566?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1547333101-6bb18e609b2f?w=500&auto=format&fit=crop&q=60",
  ];

  // Render gallery item
  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity style={styles.galleryItem}>
      <Image source={{ uri: item }} style={styles.galleryImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <Header title="Gallery" />

      {/* Gallery Grid */}
      <FlatList
        data={galleryImages}
        renderItem={renderGalleryItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.galleryList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation - This would be provided by the _layout.tsx */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  galleryList: {
    padding: 8,
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  galleryItem: {
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  galleryImage: {
    width: tileSize,
    height: tileSize,
  },
});
