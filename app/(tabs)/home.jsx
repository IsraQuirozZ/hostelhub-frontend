import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { hostelService } from "../../services/hostel.service";
import CityCard from "../../components/CityCard";
import HostelCard from "../../components/HostelCardSm";

const CITY_IMAGES = {
  Londres: require("../../assets/images/cities/londres.jpg"),
  París: require("../../assets/images/cities/paris.jpg"),
  Madrid: require("../../assets/images/cities/madrid.jpg"),
  Roma: require("../../assets/images/cities/roma.jpg"),
  Barcelona: require("../../assets/images/cities/barcelona.jpg"),
};

const FALLBACK_IMAGE = require("../../assets/images/cities/default-city.jpg");

export default function ExplorarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([]);
  const [topHostels, setTopHostels] = useState([]);
  const [allHostels, setAllHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [citiesData, topData, allData] = await Promise.all([
        hostelService.getCities(),
        hostelService.getTopHostels(),
        hostelService.getHostels(),
      ]);
      setCities(citiesData);
      setTopHostels(topData);
      setAllHostels(allData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToResults = (query, cityId = null) => {
    if (!query.trim()) return;
    router.push({
      pathname: "/hostels",
      params: { query: query.trim(), cityId },
    });
  };

  const handleCityPress = (city) => {
    goToResults(city.nombre, city.id_ciudad);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {/* Searchbox Fixed*/}
      <View style={[styles.searchWrapper, { paddingTop: insets.top + 10 }]}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.primary[500]}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Next Stop?!"
            placeholderTextColor={colors.text.muted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() => goToResults(search)}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.text.muted}
              />
            </Pressable>
          )}
          {search.length > 0 && (
            <Pressable
              style={styles.searchBtn}
              onPress={() => goToResults(search)}
            >
              <Text style={styles.searchBtnText}>Buscar</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Contenido scrollable */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <ImageBackground
            source={require("../../assets/images/home.jpg")}
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Explore Our Hostels</Text>
              <Text style={styles.heroSubtitle}>
                Book your next stay and connect{"\n"}with people around the
                world.
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Main Cities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Cities</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingRight: 16 }}
          >
            {cities.map((city) => (
              <Pressable
                key={city.id_ciudad}
                onPress={() => handleCityPress(city)}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              >
                <CityCard
                  city={city.nombre}
                  image={CITY_IMAGES[city.nombre] ?? FALLBACK_IMAGE}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Top Hostels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Hostels</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 16 }}
          >
            {topHostels.map((h, index) => (
              <HostelCard key={h.id_hostal} hostel={h} index={index} />
            ))}
          </ScrollView>
        </View>

        {/* Hostels Around the World*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hostels Around The World</Text>
          <View style={styles.worldGrid}>
            {[
              ...new Map(
                allHostels.map((h) => [h.ciudad?.id_ciudad, h.ciudad]),
              ).values(),
            ].map((ciudad) => (
              <Pressable
                key={ciudad.id_ciudad}
                style={styles.worldItem}
                onPress={() => handleCityPress(ciudad)}
              >
                <View style={styles.worldDot} />
                <Text style={styles.worldCity}>{ciudad.nombre}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background.light },
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Searchbox fija
  searchWrapper: {
    backgroundColor: colors.background.light,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,

    backgroundColor: "#FFFFFF",

    borderRadius: 30,

    borderWidth: 1,
    borderColor: colors.border.default,

    paddingHorizontal: 16,
    paddingVertical: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 6,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text.primary },
  searchBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  searchBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },

  // Hero
  hero: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 4,
  },
  heroImage: { borderRadius: 20 },
  heroOverlay: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgb(255, 255, 255)",
    lineHeight: 24,
    textAlign: "center",
  },

  // Sections
  section: { paddingHorizontal: 16, marginTop: 30 },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: colors.primary[500],
    marginBottom: 10,
  },
  worldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  worldItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  worldDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[400],
  },
  worldCity: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
