import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { postService } from "../../services/post.service";
import ButtonFull from "../../components/ui/ButtonFull";
import PostCard from "../../components/PostCard";

export default function PostDetailScreen() {
  const { id, from } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService
      .getPostById(id)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const stars = Math.round(post?.promedio_rating ?? 0);

  return (
    <ImageBackground
      source={post?.foto_url ? { uri: post.foto_url } : null}
      style={styles.bg}
      blurRadius={post?.foto_url ? 0 : 0}
    >
      <View style={[styles.overlay, !post?.foto_url && styles.overlayPlain]}>
        {/* Botones flotantes */}
        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              from === "profile"
                ? router.push("/(tabs)/profile")
                : router.back()
            }
          >
            <Ionicons name="arrow-back" size={25} color={"#ffffff"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="star-outline" size={25} color={"#ffffff"} />
          </TouchableOpacity>
        </View>

        <View style={styles.center}>
          <PostCard post={post} />
        </View>

        {/* Botón */}
        <View style={styles.footer}>
          <ButtonFull title="View on Map" onPress={() => {}} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "space-between",
  },
  overlayPlain: {
    backgroundColor: colors.background.light,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 30,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff8e",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: { paddingBottom: 50, paddingHorizontal: 16 },
});
