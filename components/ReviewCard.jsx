import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function ReviewCard({ rating }) {
  const { puntuacion, fecha_valoracion, contenido, usuario } = rating;

  const fecha = new Date(fecha_valoracion).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.fecha}>{fecha}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#F0B429" />
          <Text style={styles.puntuacion}>{puntuacion}</Text>
        </View>
      </View>

      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nombre?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <View>
          <Text style={styles.nombre}>{usuario?.nombre}</Text>
          {usuario?.nacionalidad && (
            <Text style={styles.nacionalidad}>{usuario.nacionalidad}</Text>
          )}
        </View>
      </View>

      {contenido && (
        <Text style={styles.contenido} numberOfLines={8}>
          {contenido}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fecha: { fontSize: 14, color: colors.text.muted },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  puntuacion: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
  userRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent[500],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "500", color: "#FFFFFF" },
  nombre: { fontSize: 20, fontWeight: "700", color: colors.text.primary },
  nacionalidad: { fontSize: 16, color: colors.text.muted },
  contenido: { fontSize: 16, color: colors.text.secondary },
});
