import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  Feather,
  AntDesign,
  Fontisto,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function UploadScreen() {
  const params = useLocalSearchParams();
  const procedureTitle = (params.procedureTitle as string) || "İşlem Detayı";
  const procedureSubtitle = (params.procedureSubtitle as string) || "";
  const procedureImage =
    (params.procedureImage as string) ||
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop";
  const category = (params.category as string) || "yuz";

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState(procedureTitle || "");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "Yüz");

  // Kategori ikonu alma fonksiyonu
  const getCategoryIcon = () => {
    const size = 20;
    const color = "#fff";

    switch (category) {
      case "yuz":
        return <MaterialIcons name="face" size={size} color={color} />;
      case "kulak":
        return (
          <MaterialCommunityIcons
            name="ear-hearing"
            size={size}
            color={color}
          />
        );
      case "medikal":
        return <Fontisto name="injection-syringe" size={size} color={color} />;
      case "vucut":
        return (
          <MaterialCommunityIcons name="human" size={size} color={color} />
        );
      case "gogus":
        return (
          <MaterialCommunityIcons
            name="human-female"
            size={size}
            color={color}
          />
        );
      case "popo":
        return (
          <MaterialCommunityIcons
            name="fruit-watermelon"
            size={size}
            color={color}
          />
        );
      case "kolbacak":
        return (
          <MaterialCommunityIcons name="arm-flex" size={size} color={color} />
        );
      default:
        return <MaterialIcons name="spa" size={size} color={color} />;
    }
  };

  // Kategori adını Türkçeye çevirme
  const getCategoryName = (catKey: string): string => {
    switch (catKey) {
      case "yuz":
        return "Yüz";
      case "kulak":
        return "Kulak";
      case "medikal":
        return "Medikal";
      case "vucut":
        return "Vücut";
      case "gogus":
        return "Göğüs";
      case "popo":
        return "Popo";
      case "kolbacak":
        return "Kol ve Bacak";
      default:
        return "Yüz";
    }
  };

  // Categories for the dropdown
  const categories = [
    "Yüz",
    "Medikal",
    "Vücut",
    "Kulak",
    "Göğüs",
    "Popo",
    "Kol ve Bacak",
  ];

  // Placeholder for upload functionality
  const handleUpload = () => {
    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
    }, 2000);
  };

  // Placeholder for generate functionality
  const handleGenerate = () => {
    setGenerating(true);

    // Simulate generation delay then navigate to generate screen
    setTimeout(() => {
      setGenerating(false);
      router.push({
        pathname: "/(tabs)/generate",
        params: {
          procedureTitle: title || procedureTitle,
          procedureSubtitle: procedureSubtitle,
          category: category,
        },
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Hero Image */}
      <View style={styles.heroImageContainer}>
        <ImageBackground
          source={{ uri: procedureImage }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          {/* Top Navigation */}
          <SafeAreaView style={styles.topNav}>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.categoryBadge}>
              <View style={styles.categoryIcon}>{getCategoryIcon()}</View>
              <Text style={styles.categoryBadgeText}>
                {getCategoryName(category)}
              </Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.contentTitle}>{title || procedureTitle}</Text>
          </View>

          {/* Upload Image Section */}
          <View style={styles.uploadImageSection}>
            <TouchableOpacity style={styles.uploadImageBox}>
              <View style={styles.uploadImageContent}>
                <Feather name="image" size={40} color="#555" />
                <Text style={styles.uploadImageText}>Görsel Seç</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Feather
                  name="zap"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Generate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroImageContainer: {
    height: height * 0.65,
    width: width,
  },
  heroImage: {
    flex: 1,
    justifyContent: "flex-start",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 8,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 20,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 4,
    fontWeight: "500",
    fontStyle: "italic",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginVertical: 16,
  },
  readMoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#000",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  selectedCategoryButtonText: {
    color: "#fff",
  },
  uploadImageSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  uploadImageBox: {
    width: "100%",
    height: 180,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 24,
    backgroundColor: "#f9f9f9",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImageContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadImageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  uploadImageSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 0,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
