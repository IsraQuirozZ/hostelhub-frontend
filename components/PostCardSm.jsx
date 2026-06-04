import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { useRouter } from "expo-router";

export default function PostCardSm({ post }) {
  const { titulo, contenido, promedio_rating, foto_url, ciudad } = post;
  const stars = Math.round(promedio_rating ?? 0);

  const router = useRouter();

  if (foto_url) {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/post/${post.id_post}?from=profile`)}
      >
        <Image
          source={{ uri: foto_url }}
          style={styles.imageOnly}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/post/${post.id_post}?from=profile`)}
    >
      <View style={styles.card}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.titulo} numberOfLines={1}>
              {titulo}
            </Text>
            <Text style={styles.ciudad} numberOfLines={1}>
              {ciudad?.nombre}
            </Text>
          </View>
          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <Ionicons
                key={i}
                name="star"
                size={12}
                color={i < stars ? "#F0B429" : "#E5E0D8"}
              />
            ))}
          </View>
          <Text style={styles.contenido} numberOfLines={3}>
            {contenido}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageOnly: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  body: { padding: 10, gap: 4 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  ciudad: { fontSize: 11, color: colors.text.muted, marginLeft: 4 },
  stars: { flexDirection: "row", gap: 2 },
  contenido: { fontSize: 12, color: colors.text.secondary, lineHeight: 17 },
});
