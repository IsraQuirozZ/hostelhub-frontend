import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SearchFilterCard from "../../components/SearchFilterCard";
import MapPlaceholder from "../../components/MapPlaceHolder";
import { colors } from "../../constants/colors";
import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard";
import { postService } from "../../services/post.service";

const CITY_IMAGES = {
  Madrid: require("../../assets/images/cities/madrid.jpg"),
  Barcelona: require("../../assets/images/cities/barcelona.jpg"),
  Londres: require("../../assets/images/cities/londres.jpg"),
  París: require("../../assets/images/cities/paris.jpg"),
  Roma: require("../../assets/images/cities/roma.jpg"),
};

const FALLBACK = require("../../assets/images/cities/barcelona.jpg");

export default function HostelsScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (cityId) {
      postService.getPostsByCityId(cityId).then(setPosts).catch(console.error);
    }
  }, [cityId]);

  const { query, cityId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const cityImage = CITY_IMAGES[query] ?? FALLBACK;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 12,
        }}
      >
        <ImageBackground
          source={cityImage}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Hostels in {query}</Text>

            <Text style={styles.heroSubtitle}>
              Discover the best hostels in {query}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* SearchFilterBar */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <SearchFilterCard ciudad={query} />
      </View>

      {/* Map */}
      <View style={{ paddingHorizontal: 16, marginTop: 30 }}>
        <Text style={styles.sectionTitle}>Map</Text>
        <MapPlaceholder ciudad={query} />
      </View>

      {/* Featured Posts */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Featured Posts</Text>
        {posts.length === 0 ? (
          <Text style={styles.empty}>No hay posts para esta ciudad aún</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 30 }}
          >
            {posts.map((p) => (
              <PostCard key={p.id_post} post={p} />
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },

  hero: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 4,
  },

  heroImage: {
    borderRadius: 20,
  },

  heroOverlay: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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

  backBtn: {
    position: "absolute",
    top: 15,
    left: 15,

    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "rgba(0,0,0,0.4)",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 10,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: colors.primary[500],
    marginBottom: 10,
  },

  empty: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    marginTop: 12,
  },
});
