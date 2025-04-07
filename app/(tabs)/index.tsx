import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  Fontisto,
  Entypo,
} from "@expo/vector-icons";
import Header from "../components/Header";
import { router } from "expo-router";

// Get screen width to calculate card dimensions
const { width } = Dimensions.get("window");
const cardWidth = (width - 45) / 2; // Account for padding and gap

// Define types for component props
interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl: string | any; // Allow both URL strings and require() object
  category: string;
}

interface NavIconProps {
  name: "home" | "gallery" | "pro" | "profile" | string;
  isActive: boolean;
}

// Define types for category component props
interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  backgroundColor: string;
  isSelected: boolean;
  onSelect: () => void;
}

// Define types for tab selector props
interface TabSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Define types for procedure items
interface ProcedureItem {
  title: string;
  subtitle?: string;
  imageUrl: string | any; // Allow both URL strings and require() object
}

interface ProcedureData {
  yuz: ProcedureItem[];
  kulak: ProcedureItem[];
  medikal: ProcedureItem[];
  vucut: ProcedureItem[];
  gogus: ProcedureItem[];
  popo: ProcedureItem[];
  kolbacak: ProcedureItem[];
  [key: string]: ProcedureItem[];
}

// Import face_covers assets
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

// Card component for displaying procedures
const Card = ({ title, subtitle, imageUrl, category }: CardProps) => {
  // Determine if the image source is a URL string or a local require
  const isUrl = typeof imageUrl === "string";

  // Handle navigation with proper image handling
  const handleCardPress = () => {
    // Generate a normalized key for local images
    let localKey = "";

    if (!isUrl) {
      // Extract filename from require structure for more reliable mapping
      // The require sources have format like: faceCovers.burunEstetigi
      // We want to extract just "burunEstetigi" and normalize it
      const keyParts = Object.entries(faceCovers).find(
        ([key, value]) => value === imageUrl
      );

      if (keyParts) {
        localKey = keyParts[0]; // Use the key directly from faceCovers object
        console.log("Found local key:", localKey, "for procedure:", title);
      } else {
        // Fallback to title-based key if we can't find the image
        localKey = title
          .toLowerCase()
          .replace(/ı/g, "i")
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/\s+/g, "_");
        console.log("Using fallback key:", localKey, "for procedure:", title);
      }
    }

    // Navigate to upload screen
    router.push({
      pathname: "/(tabs)/upload",
      params: {
        procedureTitle: title,
        procedureSubtitle: subtitle,
        procedureImage: isUrl ? imageUrl : "",
        category: category,
        isLocalImage: isUrl ? "false" : "true",
        localImageKey: localKey,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <ImageBackground
        source={isUrl ? { uri: imageUrl as string } : imageUrl}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 12 }}
      />
      <View style={styles.cardContentBelow}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

// Announcement banner component
const AnnouncementBanner = () => {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=800&auto=format&fit=crop",
      }}
      style={styles.announcementBanner}
    >
      <View style={styles.announcementOverlay}>
        <Text style={styles.announcementTitle}>New Collection</Text>
        <Text style={styles.announcementSubtitle}>
          Discover our latest abstract art series
        </Text>
      </View>
    </ImageBackground>
  );
};

// Icon component for bottom navigation
const NavIcon = ({ name, isActive }: NavIconProps) => {
  const getIcon = () => {
    const color = isActive ? "#fff" : "#6e6e6e";
    const size = 22;

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

  return (
    <View
      style={[
        styles.navIconContainer,
        isActive && styles.activeNavIconContainer,
      ]}
    >
      {getIcon()}
    </View>
  );
};

// Category component for aesthetic procedures
const CategoryCard = ({
  icon,
  title,
  backgroundColor,
  isSelected,
  onSelect,
}: CategoryCardProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { backgroundColor: isSelected ? "#000" : "rgba(255, 255, 255, 0.9)" },
      ]}
      onPress={onSelect}
    >
      <View
        style={[
          styles.categoryIconContainer,
          {
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.2)"
              : backgroundColor,
          },
        ]}
      >
        {React.cloneElement(icon as React.ReactElement, {
          color: isSelected ? "#fff" : "#fff",
          size: 22,
        })}
      </View>
      <Text
        style={[styles.categoryTitle, { color: isSelected ? "#fff" : "#333" }]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Tab selector component
const TabSelector = ({ activeTab, onTabChange }: TabSelectorProps) => {
  const getTabIcon = (tabId: string, isActive: boolean) => {
    const color = isActive ? "#fff" : "#666";
    const size = 18;

    switch (tabId) {
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

  return (
    <View style={{ marginHorizontal: -15 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }}
      >
        <View style={styles.tabSelectorContainer}>
          {/* Yüz */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "yuz"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("yuz")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("yuz", activeTab === "yuz")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "yuz" && styles.activeTabText,
              ]}
            >
              Yüz
            </Text>
          </TouchableOpacity>

          {/* Medikal */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "medikal"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("medikal")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("medikal", activeTab === "medikal")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "medikal" && styles.activeTabText,
              ]}
            >
              Medikal
            </Text>
          </TouchableOpacity>

          {/* Vücut */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "vucut"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("vucut")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("vucut", activeTab === "vucut")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "vucut" && styles.activeTabText,
              ]}
            >
              Vücut
            </Text>
          </TouchableOpacity>

          {/* Kulak */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "kulak"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("kulak")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("kulak", activeTab === "kulak")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "kulak" && styles.activeTabText,
              ]}
            >
              Kulak
            </Text>
          </TouchableOpacity>

          {/* Göğüs */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "gogus"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("gogus")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("gogus", activeTab === "gogus")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "gogus" && styles.activeTabText,
              ]}
            >
              Göğüs
            </Text>
          </TouchableOpacity>

          {/* Popo */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "popo"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("popo")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("popo", activeTab === "popo")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "popo" && styles.activeTabText,
              ]}
            >
              Popo
            </Text>
          </TouchableOpacity>

          {/* Kol ve Bacak */}
          <TouchableOpacity
            style={[
              styles.tabOption,
              activeTab === "kolbacak"
                ? styles.activeTabOption
                : styles.inactiveTabOption,
            ]}
            onPress={() => onTabChange("kolbacak")}
          >
            <View style={styles.tabIconContainer}>
              {getTabIcon("kolbacak", activeTab === "kolbacak")}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === "kolbacak" && styles.activeTabText,
              ]}
            >
              Kol ve Bacak
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  // Sample Unsplash image URLs with colorful abstract designs
  const unsplashImages = [
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
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1614849963640-9cc74b2a385b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1586672806791-3a67d24186c0?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1578255321055-68b5bc99052b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1617791160588-241658c0f566?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=500&auto=format&fit=crop&q=60",
  ];

  // Define subcategories for each category
  const procedureData: ProcedureData = {
    yuz: [
      {
        title: "Burun Estetiği",
        subtitle: "Rinoplasti",
        imageUrl: faceCovers.burun_estetigi,
      },
      {
        title: "Saç Ekimi",
        subtitle: "Hair Transplantation",
        imageUrl: faceCovers.sac_ekimi,
      },
      {
        title: "Çene Estetiği",
        subtitle: "Genioplasti",
        imageUrl: faceCovers.cene_estetigi,
      },
      {
        title: "Yüz Germe",
        subtitle: "Ritidektomi",
        imageUrl: faceCovers.yuz_germe,
      },
      {
        title: "Göz Kapağı Estetiği",
        subtitle: "Blefaroplasti",
        imageUrl: faceCovers.goz_kapagi,
      },
      {
        title: "Kaş Kaldırma",
        subtitle: "Frontal Lift",
        imageUrl: faceCovers.kas_kaldirma,
      },
      {
        title: "Elmacık Kemiği",
        subtitle: "Malar Augmentasyon",
        imageUrl: faceCovers.elmacik_kemigi,
      },
      {
        title: "Dudak Estetiği",
        subtitle: "Lip Enhancement",
        imageUrl: faceCovers.dudak_estetigi,
      },
    ],
    kulak: [
      {
        title: "Kepçe Kulak Ameliyatı",
        subtitle: "Otoplasti",
        imageUrl: unsplashImages[7],
      },
    ],
    medikal: [
      {
        title: "Dolgu",
        subtitle: "Dermal Filler",
        imageUrl: unsplashImages[8],
      },
      {
        title: "Botoks",
        subtitle: "Nörotoksin Enjeksiyonu",
        imageUrl: unsplashImages[9],
      },
      {
        title: "Mezoterapi",
        subtitle: "Biorevitalizasyon",
        imageUrl: unsplashImages[10],
      },
      {
        title: "PRP",
        subtitle: "Platelet Rich Plasma",
        imageUrl: unsplashImages[11],
      },
      {
        title: "Leke Tedavileri",
        subtitle: "Hiperpigmentasyon Terapisi",
        imageUrl: unsplashImages[12],
      },
      {
        title: "Cilt Gençleştirme",
        subtitle: "Rejuvenasyon",
        imageUrl: unsplashImages[13],
      },
    ],
    vucut: [
      {
        title: "Karın Germe",
        subtitle: "Abdominoplasti",
        imageUrl: unsplashImages[0],
      },
      {
        title: "Liposuction",
        subtitle: "Liposculpture",
        imageUrl: unsplashImages[1],
      },
      {
        title: "Yağ Enjeksiyonu",
        subtitle: "Lipotransfer",
        imageUrl: unsplashImages[2],
      },
      {
        title: "Bel İncelme",
        subtitle: "Waist Contouring",
        imageUrl: unsplashImages[3],
      },
    ],
    gogus: [
      {
        title: "Göğüs Büyütme",
        subtitle: "Augmentasyon Mammoplasti",
        imageUrl: unsplashImages[4],
      },
      {
        title: "Göğüs Küçültme",
        subtitle: "Redüksiyon Mammoplasti",
        imageUrl: unsplashImages[5],
      },
      {
        title: "Göğüs Dikleştirme",
        subtitle: "Mastopeksi",
        imageUrl: unsplashImages[6],
      },
    ],
    popo: [
      {
        title: "Popo Büyütme",
        subtitle: "Gluteal Augmentasyon",
        imageUrl: unsplashImages[7],
      },
      {
        title: "Popo Şekillendirme",
        subtitle: "Gluteoplasti",
        imageUrl: unsplashImages[8],
      },
    ],
    kolbacak: [
      {
        title: "Kol Germe",
        subtitle: "Brachioplasti",
        imageUrl: unsplashImages[9],
      },
      {
        title: "Bacak Germe",
        subtitle: "Kruoplasti",
        imageUrl: unsplashImages[10],
      },
      {
        title: "Baldır Estetiği",
        subtitle: "Gastrocnemius Augmentasyon",
        imageUrl: unsplashImages[11],
      },
    ],
  };

  // State to track active tab
  const [activeTab, setActiveTab] = useState("yuz");

  // Get procedures for the active tab
  const activeProcedures = procedureData[activeTab] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <Header />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Announcement Banner */}
        <AnnouncementBanner />

        {/* Features Heading */}
        <Text style={styles.featuresHeading}># Estetik İşlemler</Text>

        {/* Tab Selector */}
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Procedures Grid */}
        <View style={styles.cardGrid}>
          {activeProcedures.map((procedure: ProcedureItem, index: number) => (
            <Card
              key={index}
              title={procedure.title}
              subtitle={procedure.subtitle}
              imageUrl={procedure.imageUrl}
              category={activeTab}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNavContainer}>
          <BlurView intensity={30} style={styles.bottomNavBlur}>
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem}>
                <NavIcon name="home" isActive={true} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <NavIcon name="gallery" isActive={false} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <NavIcon name="pro" isActive={false} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <NavIcon name="profile" isActive={false} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 100, // Extra space at the bottom for the navigation bar
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.5)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 260,
  },
  cardContentBelow: {
    padding: 12,
    backgroundColor: "#fff",
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
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
  navIcon: {
    fontSize: 20,
    color: "#6e6e6e",
  },
  activeNavIcon: {
    color: "#fff",
  },
  announcementBanner: {
    width: "100%",
    height: 180,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  announcementOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
    justifyContent: "flex-end",
  },
  announcementTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  announcementSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    maxWidth: "80%",
  },
  featuresHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
    marginTop: 5,
    letterSpacing: 0.5,
  },
  tabSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  tabScrollView: {
    marginBottom: 15,
  },
  tabOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
  },
  activeTabOption: {
    backgroundColor: "#1A1A1A",
  },
  inactiveTabOption: {
    backgroundColor: "#F0F0F0",
  },
  tabIconContainer: {
    marginRight: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 2,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  tabSubText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#888",
    fontStyle: "italic",
  },
  activeTabSubText: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesList: {
    padding: 10,
  },
  categoryCard: {
    minWidth: 90,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    paddingHorizontal: 6,
    paddingRight: 16,
  },
  categoryIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 0,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: -2,
    width: 20,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 1.5,
  },
  categoriesContent: {
    paddingHorizontal: 5,
  },
});
