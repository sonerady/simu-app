import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  FlatList,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

// Simülasyon aşamalarını tanımlıyorum
const simulationStages = [
  { id: "1", title: "Estetik Öncesi", day: "Başlangıç" },
  { id: "2", title: "Ameliyat Sonrası", day: "İlk Gün" },
  { id: "3", title: "İyileşme Süreci", day: "3. Gün" },
  { id: "4", title: "İyileşme Süreci", day: "7. Gün" },
  { id: "5", title: "İyileşme Süreci", day: "14. Gün" },
  { id: "6", title: "Final Sonuç", day: "1-2 Ay Sonrası" },
];

// Boş kart bileşeni
const EmptyCard = ({ title, day }: { title: string; day: string }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.emptyImageContainer}>
          <Feather name="image" size={40} color="#ccc" />
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{day}</Text>
      </View>
    </View>
  );
};

export default function GenerateScreen() {
  const params = useLocalSearchParams();
  const procedureTitle =
    (params.procedureTitle as string) || "İşlem Simülasyonu";
  const category = (params.category as string) || "yuz";

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
        return "Kategori";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{procedureTitle}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.subHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryName(category)}</Text>
          </View>
          <Text style={styles.simulationText}>Simülasyon</Text>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>İyileşme Süreci</Text>
        <Text style={styles.sectionDescription}>
          Bu simülasyon, {procedureTitle} işleminin farklı aşamalarını
          göstermektedir. İyileşme süreci kişiden kişiye değişiklik
          gösterebilir.
        </Text>

        {/* Simülasyon Kartları */}
        <View style={styles.cardsContainer}>
          {simulationStages.map((stage) => (
            <EmptyCard key={stage.id} title={stage.title} day={stage.day} />
          ))}
        </View>

        {/* Bilgilendirme Notu */}
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color="#555"
          />
          <Text style={styles.infoText}>
            Gerçek sonuçlar kişiden kişiye farklılık gösterebilir. Bu görseller
            yalnızca bilgilendirme amaçlıdır.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  simulationText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContainer: {
    width: (width - 50) / 2,
    marginBottom: 25,
  },
  card: {
    width: "100%",
    height: 180,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  cardInfo: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ddd",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    marginLeft: 10,
    lineHeight: 18,
  },
});
