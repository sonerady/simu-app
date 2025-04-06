import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/Header";

const { width, height } = Dimensions.get("window");

// Görsel veri tipi tanımı
interface ImageItem {
  id: string;
  url: string;
}

// Örnek resim verileri
const imageData: ImageItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?q=80&w=2864&auto=format&fit=crop",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2961&auto=format&fit=crop",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2888&auto=format&fit=crop",
  },
];

export default function ProScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<ImageItem>>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("weekly");

  // Animation value for bottom sheet
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;

  const navigateToHome = () => {
    router.navigate("/(tabs)");
  };

  // Otomatik kaydırma için zamanlayıcı
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (activeIndex === imageData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }, 3000); // Her 3 saniyede bir resim değişecek

    return () => clearInterval(intervalId);
  }, [activeIndex]);

  // FlatList öğe genişlik ayarları
  const imageItemWidth = width * 0.9;
  const imageItemSpacing = width * 0.05;

  // Kaydırma olayını işle
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / imageItemWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  // Resim öğesi render fonksiyonu
  const renderImageItem = ({ item }: { item: ImageItem }) => (
    <View
      style={[
        styles.imageContainer,
        { width: imageItemWidth, marginHorizontal: imageItemSpacing / 2 },
      ]}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* No Watermark Badge */}
      <View style={styles.noWatermarkBadge}>
        <View style={styles.badgeCircle}>
          <Text style={styles.noText}>NO</Text>
          <Text style={styles.watermarkText}>WATERMARK</Text>
          <View style={styles.diagonalLine} />
        </View>
      </View>
    </View>
  );

  // Plan bilgileri
  const plans = [
    {
      id: "weekly",
      title: "Weekly",
      price: "$4.99",
      period: "week",
      popular: true,
    },
    {
      id: "monthly",
      title: "Monthly",
      price: "$12.99",
      period: "month",
      popular: false,
    },
    {
      id: "yearly",
      title: "Yearly",
      price: "$54.99",
      period: "year",
      popular: false,
      discount: "Save 54%",
    },
  ];

  // Open bottom sheet
  const openBottomSheet = () => {
    setShowBottomSheet(true);
    Animated.timing(bottomSheetAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close bottom sheet
  const closeBottomSheet = () => {
    Animated.timing(bottomSheetAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowBottomSheet(false);
    });
  };

  // Plan selection function - don't close the bottom sheet
  const selectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Don't close the bottom sheet when selecting a plan
  };

  // Seçili planı bul
  const currentPlan = plans.find((plan) => plan.id === selectedPlan);

  // Calculate bottom sheet translation
  const translateY = bottomSheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
    extrapolate: "clamp",
  });

  // Calculate backdrop opacity
  const backdropOpacity = bottomSheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header using the new component */}
      <Header title="Simu.ai" onBackPress={navigateToHome} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Carousel Images */}
        <FlatList
          ref={flatListRef}
          data={imageData}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          snapToInterval={imageItemWidth + imageItemSpacing}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: imageItemSpacing / 2 }}
        />

        {/* Carousel Indicators */}
        <View style={styles.indicatorContainer}>
          {imageData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Trial Info */}
        <Text style={styles.trialText}>3 Days Free Trial</Text>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* Pricing */}
        <Text style={styles.pricingText}>
          Then {currentPlan?.title} {currentPlan?.price}
        </Text>

        {/* Other Plans */}
        <TouchableOpacity onPress={openBottomSheet}>
          <Text style={styles.otherPlansText}>See other plans</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Terms of Use</Text>
          <Text style={styles.footerSeparator}>|</Text>
          <Text style={styles.footerText}>Privacy Policy</Text>
          <Text style={styles.footerSeparator}>|</Text>
          <Text style={styles.footerText}>Restore Purchase</Text>
        </View>
      </ScrollView>

      {/* Custom Bottom Sheet */}
      {showBottomSheet && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback onPress={closeBottomSheet}>
            <Animated.View
              style={[styles.backdrop, { opacity: backdropOpacity }]}
            />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY }] },
            ]}
          >
            <View style={styles.bottomSheetHandle} />

            <View style={styles.bottomSheetContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Your Plan</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeBottomSheet}
                >
                  <Ionicons name="close-circle" size={28} color="#FF4B4B" />
                </TouchableOpacity>
              </View>

              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planOption,
                    selectedPlan === plan.id && styles.selectedPlanOption,
                  ]}
                  onPress={() => selectPlan(plan.id)}
                >
                  <View style={styles.planOptionContent}>
                    <View style={styles.planInfoSection}>
                      <Text style={styles.planTitle}>{plan.title}</Text>
                    </View>

                    <View style={styles.planPriceSection}>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>/{plan.period}</Text>
                    </View>
                  </View>

                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  )}

                  {plan.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{plan.discount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={closeBottomSheet}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                Cancel anytime. Subscription auto-renews until cancelled.
              </Text>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: "90%",
    height: 450,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  noWatermarkBadge: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "black",
  },
  diagonalLine: {
    position: "absolute",
    width: "120%",
    height: 2,
    backgroundColor: "white",
    top: "50%",
    left: "-10%",
    transform: [{ rotate: "45deg" }],
  },
  noText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  watermarkText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
    marginTop: -5,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#FF4B4B",
  },
  trialText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  continueButton: {
    width: "90%",
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#FF4B4B",
    // Gradient Background Effect
    shadowColor: "#FF9899",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  pricingText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  otherPlansText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
  footerSeparator: {
    marginHorizontal: 8,
    color: "#999",
  },
  // Custom Bottom Sheet Styles
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 1,
  },
  bottomSheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 20,
    zIndex: 2,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 10,
  },
  bottomSheetContent: {
    paddingHorizontal: 25,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  modalCloseButton: {
    padding: 5,
  },
  planOption: {
    borderWidth: 2,
    borderColor: "#EAEAEA",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedPlanOption: {
    borderColor: "#FF4B4B",
    backgroundColor: "rgba(255, 75, 75, 0.05)",
    shadowColor: "#FF4B4B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  planOptionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planInfoSection: {
    flex: 1,
  },
  planPriceSection: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#777",
    marginLeft: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 15,
    backgroundColor: "#FF4B4B",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: "#FF4B4B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  popularText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  discountBadge: {
    position: "absolute",
    top: -12,
    right: 15,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkmarkContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  confirmButton: {
    backgroundColor: "#FF4B4B",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#FF4B4B",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  termsText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 15,
  },
});
