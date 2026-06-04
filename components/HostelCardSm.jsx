import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { useRouter } from "expo-router";

const HOSTEL_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
  "https://images.unsplash.com/photo-1520277739336-7bf67430bd9c?w=400",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
];

export default function HostelCard({ hostel, index = 0 }) {
  const image = HOSTEL_IMAGES[index % HOSTEL_IMAGES.length];
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/hostel/${hostel.id_hostal}`)}
    >
      <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {hostel.nombre}
          </Text>
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.text.muted}
            />
            <Text style={styles.city}>{hostel.ciudad?.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="star" size={13} color="#F0B429" />
            <Text style={styles.rating}>{hostel.promedio_rating ?? "—"}</Text>
            <Text style={styles.capacity}>· {hostel.capacidad} personas</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  image: { width: "100%", height: 140, backgroundColor: colors.primary[100] },
  body: { padding: 10, gap: 5 },
  name: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  city: { fontSize: 12, color: colors.text.muted },
  rating: { fontSize: 13, fontWeight: "700", color: colors.text.primary },
  capacity: { fontSize: 12, color: colors.text.muted },
});
