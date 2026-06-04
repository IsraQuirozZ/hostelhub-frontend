import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { useRouter } from "expo-router";

const HOSTEL_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600",
  "https://images.unsplash.com/photo-1520277739336-7bf67430bd9c?w=600",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
];

export default function HostelCardLg({
  hostel,
  index = 0,
  checkIn,
  checkOut,
  guests,
}) {
  const image = HOSTEL_IMAGES[index % HOSTEL_IMAGES.length];
  const precio = hostel.habitaciones?.[0]?.precio_base ?? "—";
  const rating = hostel.promedio_rating ?? 0;
  const servicios = hostel.servicios?.slice(0, 3) ?? [];

  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/hostel/${hostel.id_hostal}`,
          params: {
            checkInParam: checkIn,
            checkOutParam: checkOut,
            guestsParam: guests,
          },
        })
      }
    >
      <View style={styles.card}>
        {/* Imagen */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.heartBtn}>
            <Ionicons
              name="heart-outline"
              size={25}
              color={colors.accent[500]}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.body}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio por noche</Text>
            <Text style={styles.price}>{precio}€</Text>
          </View>

          <Text style={styles.nombre}>{hostel.nombre}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#F0B429" />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.reviews}>({rating ?? "—"} reviews)</Text>
          </View>

          {/* Servicios */}
          {servicios.length > 0 && (
            <View style={styles.servicios}>
              {servicios.map(({ servicio }) => (
                <View key={servicio.id_servicio} style={styles.servicioItem}>
                  <Ionicons
                    name={servicio.icono}
                    size={25}
                    color={colors.primary[600]}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  imageWrapper: { aspectRatio: 1 },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ffffff86",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  body: { padding: 14, gap: 6 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { fontSize: 16, color: colors.text.muted },
  price: { fontSize: 20, fontWeight: "800", color: colors.accent[500] },
  nombre: { fontSize: 20, fontWeight: "800", color: colors.text.primary },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  reviews: { fontSize: 16, color: colors.text.muted },
  servicios: { flexDirection: "row", gap: 12, marginTop: 6 },
  servicioItem: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background.light,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
