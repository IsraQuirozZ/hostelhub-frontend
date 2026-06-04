import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { postService } from "../../services/post.service";
import PostCardSm from "../../components/PostCardSm";
import { ScrollView } from "react-native";
import Divider from "../../components/ui/Divider";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Posts
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/users/me")
      .then(({ data }) => setUser(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    postService.getMyPosts().then(setPosts).catch(console.error);
  }, []);

  const getAge = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const diff = Date.now() - new Date(fechaNacimiento).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const age = getAge(user?.fecha_nacimiento);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="heart-outline"
            size={25}
            color={colors.primary[600]}
          />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nombre?.slice(0, 2).toUpperCase() ?? "??"}
            </Text>
          </View>
          <Text style={styles.nombre}>{user?.nombre}</Text>
          <Text style={styles.meta}>
            {[age ? `${age} years` : null, user?.nacionalidad]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push("/profile/edit")}
        >
          <Ionicons
            name="settings-outline"
            size={25}
            color={colors.primary[600]}
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons
            name="globe-outline"
            size={30}
            color={colors.primary[500]}
          />
          <View>
            <Text style={styles.statNumber}>
              {user?._count?.paises_visitados ?? 0}
            </Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="bed-outline" size={30} color={colors.accent[500]} />
          <View>
            <Text style={styles.statNumber}>
              {user?._count?.reservas_confirmadas ?? 0}
            </Text>
            <Text style={styles.statLabel}>Hostels</Text>
          </View>
        </View>
      </View>

      <Divider />

      {/* My Posts */}
      {/* My Posts */}
      <View style={styles.feed}>
        {posts.map((post) => (
          <View
            key={post.id_post}
            style={post.foto_url ? styles.oneCol : styles.twoCol}
          >
            <PostCardSm post={post} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  avatarSection: { alignItems: "center", gap: 6 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: { fontSize: 40, fontWeight: "600", color: "#FFFFFF" },
  nombre: { fontSize: 24, fontWeight: "700", color: colors.primary[600] },
  meta: { fontSize: 18, color: colors.text.muted },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 40,
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    justifyContent: "space-between",
  },
  statItem: {
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border.default },
  statNumber: { fontSize: 20, fontWeight: "800", color: colors.text.primary },
  statLabel: { fontSize: 16, color: colors.text.muted },

  // Post
  feed: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  oneCol: { width: "31%" },
  twoCol: { width: "65%" },
  fullWidth: { width: "100%" },
  halfWidth: { width: "48%" },
});
