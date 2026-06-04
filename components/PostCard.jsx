import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function PostCard({ post }) {
  const { titulo, contenido, promedio_rating, usuario, foto_url } = post;

  const stars = Math.round(promedio_rating ?? 0);

  return (
    <View style={[styles.card, !foto_url && styles.cardWithoutImage]}>
      {/* Imagen cuadrada */}
      {foto_url && (
        <Image
          source={{ uri: foto_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Título + avatar */}
      <View style={styles.header}>
        <Text style={styles.titulo} numberOfLines={1}>
          {titulo}
        </Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
      </View>

      {/* Estrellas */}
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name="star"
            size={18}
            color={i < stars ? "#F0B429" : "#E5E0D8"}
          />
        ))}
      </View>

      {/* Contenido */}
      <Text style={styles.contenido} numberOfLines={3}>
        {contenido}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  titulo: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent[500],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  stars: { flexDirection: "row", gap: 2, marginBottom: 6 },
  contenido: { fontSize: 13, color: colors.text.secondary, lineHeight: 19 },
  cardWithoutImage: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 16,
    padding: 12,
  },
});
