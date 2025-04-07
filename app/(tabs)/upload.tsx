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

// Import face_covers assets for local images
const faceCovers = {
  burun_estetigi: require("../../assets/face_covers/burun_estetigi.png"),
  sac_ekimi: require("../../assets/face_covers/sac_ekimi.png"),
  cene_estetigi: require("../../assets/face_covers/cene_estetigi.png"),
  yuz_germe: require("../../assets/face_covers/yuz_germe.png"),
  goz_kapagi: require("../../assets/face_covers/goz_kapagi.png"),
  kas_kaldirma: require("../../assets/face_covers/kas_kaldirma.png"),
  elmacik_kemigi: require("../../assets/face_covers/elmacik_kemigi.png"),
  dudak_estetigi: require("../../assets/face_covers/dudak_estetigi.png"),
};

// Fallback image URL
const fallbackImage =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop";

export default function UploadScreen() {
  const params = useLocalSearchParams();
  const procedureTitle = (params.procedureTitle as string) || "İşlem Detayı";
  const procedureSubtitle = (params.procedureSubtitle as string) || "";
  const procedureImage = (params.procedureImage as string) || fallbackImage;
  const category = (params.category as string) || "yuz";
  const isLocalImage = (params.isLocalImage as string) === "true";
  const localImageKey = (params.localImageKey as string) || "";

  // State variables
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState(procedureTitle || "");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "Yüz");
  const [showExampleModal, setShowExampleModal] = useState(false);

  // Example images for different categories
  const getExampleImages = () => {
    // Return metin açıklamaları yerine görseller
    return [
      {
        title: "Doğru Açı",
        description:
          "Yüzünüzün önden, net bir şekilde göründüğü fotoğraf çekin. Göz seviyesinde, dengeli ve düz bir açı kullanın.",
      },
      {
        title: "Doğru Işık",
        description:
          "Doğal ışığı tercih edin, pencere kenarında veya açık havada yumuşak ışık altında fotoğraf çekin.",
      },
      {
        title: "Uygun Arka Plan",
        description:
          "Sade, tek renkli ve dağınık olmayan bir arka plan önünde poz verin. Dikkat dağıtıcı unsurlar olmamalı.",
      },
    ];
  };

  // Get the appropriate image source - local or remote
  const getImageSource = () => {
    console.log("Image params:", {
      isLocalImage,
      localImageKey,
      procedureImage,
    });

    if (isLocalImage && localImageKey) {
      // Try to match directly with our local images keys
      if (localImageKey in faceCovers) {
        console.log("Direct match found for key:", localImageKey);
        return faceCovers[localImageKey as keyof typeof faceCovers];
      }

      // Try normalized match as fallback
      const normalizedKey = localImageKey
        .toLowerCase()
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/_/g, "")
        .replace(/\s+/g, "");

      console.log("Normalized key:", normalizedKey);

      // Attempt to find a similar key match
      const similarKey = Object.keys(faceCovers).find(
        (key) => key.replace(/_/g, "") === normalizedKey
      );

      if (similarKey) {
        console.log("Found similar key match:", similarKey);
        return faceCovers[similarKey as keyof typeof faceCovers];
      }

      // Hardcoded fallbacks based on common procedure names
      switch (normalizedKey) {
        case "burunestetigi":
          return faceCovers.burun_estetigi;
        case "sacekimi":
          return faceCovers.sac_ekimi;
        case "ceneestetigi":
          return faceCovers.cene_estetigi;
        case "yuzgerme":
          return faceCovers.yuz_germe;
        case "gozkapagiestetigi":
          return faceCovers.goz_kapagi;
        case "kaskaldirma":
          return faceCovers.kas_kaldirma;
        case "elmacikkemigi":
          return faceCovers.elmacik_kemigi;
        case "dudakestetigi":
          return faceCovers.dudak_estetigi;
        default:
          console.log("No match found for", normalizedKey);
          // If no matching local image, use the fallback
          return { uri: fallbackImage };
      }
    }

    // If not a local image, use the URL
    return { uri: procedureImage || fallbackImage };
  };

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

  // Example modal component
  const ExampleModal = () => {
    if (!showExampleModal) return null;

    return (
      <View style={styles.modalOverlay}>
        <StatusBar style="light" />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Fotoğraf Çekim Önerileri</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowExampleModal(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.exampleTipsScroll}
          >
            {getExampleImages().map((item, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipIconContainer}>
                  {index === 0 ? (
                    <Ionicons name="camera" size={24} color="#333" />
                  ) : index === 1 ? (
                    <Ionicons name="sunny" size={24} color="#333" />
                  ) : (
                    <Ionicons name="image-outline" size={24} color="#333" />
                  )}
                </View>
                <Text style={styles.tipTitle}>{item.title}</Text>
                <Text style={styles.tipDescription}>{item.description}</Text>
              </View>
            ))}

            <Text style={styles.exampleTips}>
              • Yüz önden ve net bir şekilde görünmeli
              {"\n"}• Doğal ışık tercih edilmeli
              {"\n"}• Sade bir arka plan kullanılmalı
              {"\n"}• Filtre veya düzenleme olmadan gerçek görüntü
            </Text>
          </ScrollView>

          <Text style={styles.exampleDisclaimer}>
            Not: Bu öneriler daha iyi sonuçlar elde etmenize yardımcı olacaktır.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style={showExampleModal ? "light" : "light"} />
      <ExampleModal />

      {/* Hero Image */}
      <View style={styles.heroImageContainer}>
        <ImageBackground
          source={getImageSource()}
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
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryBadgeText}>
                  {title || procedureTitle}
                </Text>
                <Text style={styles.categoryBadgeSubText}>
                  {procedureSubtitle}
                </Text>
              </View>
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
          {/* Upload Image Section */}
          <View style={styles.uploadImageSection}>
            <TouchableOpacity
              style={styles.uploadImageBox}
              onPress={handleUpload}
            >
              <View style={styles.uploadImageContent}>
                <Feather name="image" size={40} color="#555" />
                <Text style={styles.uploadImageText}>Görsel Seç</Text>
                <Text style={styles.uploadImageSubText}>
                  JPEG, PNG veya HEIC formatında
                </Text>
              </View>
            </TouchableOpacity>

            {/* Photo Guidance Text */}
            <View style={styles.guidanceContainer}>
              <Text style={styles.photoGuidanceText}>
                Yüz bölgenizin net göründüğü, doğal ışıklı bir fotoğraf
                yükleyin.
                <Text
                  style={styles.photoTipsLink}
                  onPress={() => setShowExampleModal(true)}
                >
                  {" "}
                  Öneriler →
                </Text>
              </Text>
            </View>
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
    height: height * 0.55,
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
    maxWidth: width * 0.6,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  categoryBadgeSubText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    paddingTop: 30,
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
    height: 220,
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
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  exampleTipsScroll: {
    maxHeight: 350,
    marginBottom: 10,
  },
  tipCard: {
    flexDirection: "column",
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tipIconContainer: {
    backgroundColor: "#f5f5f5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  exampleTips: {
    color: "#333",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 10,
  },
  exampleDisclaimer: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 15,
    textAlign: "center",
  },
  helperText: {
    color: "#555",
    fontSize: 15,
    marginBottom: 20,
    fontStyle: "italic",
    lineHeight: 22,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#000",
  },
  photoGuidanceText: {
    color: "#666",
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 18,
  },
  photoTipsLink: {
    color: "#4CAF50",
    fontWeight: "600",
    textDecorationLine: "none",
  },
  guidanceContainer: {
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
});
