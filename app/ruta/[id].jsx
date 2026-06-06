import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { useEffect, useState } from "react";
import { rutaService } from "../../services/ruta.service";

const TIPO_ICONS = {
  hostal: "bed-outline",
  museo: "business-outline",
  restaurante: "restaurant-outline",
  parque: "leaf-outline",
  monumento: "flag-outline",
  barrio: "map-outline",
  otro: "location-outline",
};

const TIPO_COLORS = {
  hostal: colors.primary[500],
  museo: "#9B59B6",
  restaurante: colors.accent[500],
  parque: colors.success,
  monumento: "#E67E22",
  barrio: "#3498DB",
  otro: colors.text.muted,
};

export default function RutaScreen() {
  const { id_reserva } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    rutaService
      .getRuta(id_reserva)
      .then(setRuta)
      .catch(() => setError("No hay ruta disponible para esta reserva"))
      .finally(() => setLoading(false));
  }, [id_reserva]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/reservas")}
        >
          <Ionicons name="arrow-back" size={25} color={"#FFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rutas</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.primary[500]}
          />
          <Text style={styles.infoText}>
            Ruta generada con IA basada en los mejores posts de viajeros en{" "}
            {ruta?.ciudad}
          </Text>
        </View>

        {error ? (
          <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.center}>
              <Ionicons
                name="map-outline"
                size={48}
                color={colors.text.muted}
              />
              <Text style={styles.errorTitle}>Ruta no disponible</Text>
              <Text style={styles.errorText}>
                Esta reserva no tiene una ruta generada aún
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.timeline}>
            {ruta?.paradas?.map((parada, index) => {
              const isLast = index === ruta.paradas.length - 1;
              const color = TIPO_COLORS[parada.tipo] ?? colors.text.muted;
              const icon = TIPO_ICONS[parada.tipo] ?? "location-outline";
              return (
                <View key={parada.orden} style={styles.paradaWrapper}>
                  <View style={styles.lineWrapper}>
                    <View style={[styles.dot, { backgroundColor: color }]}>
                      <Ionicons name={icon} size={14} color="#FFFFFF" />
                    </View>
                    {!isLast && <View style={styles.line} />}
                  </View>
                  <View style={styles.paradaCard}>
                    <View style={styles.paradaHeader}>
                      <Text style={styles.paradaNombre}>{parada.nombre}</Text>
                      {parada.es_de_app && (
                        <View style={styles.appBadge}>
                          <Text style={styles.appBadgeText}>En app</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.paradaTipo}>{parada.tipo}</Text>
                    <Text style={styles.paradaDesc}>{parada.descripcion}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0000004a",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.primary[600] },
  content: { padding: 20, gap: 4 },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.primary[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary[600],
    flex: 1,
    lineHeight: 18,
  },
  timeline: { gap: 0 },
  paradaWrapper: { flexDirection: "row", gap: 12 },
  lineWrapper: { alignItems: "center", width: 36 },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.default,
    marginVertical: 4,
  },
  paradaCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: 12,
    gap: 4,
  },
  paradaHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  paradaNombre: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  appBadge: {
    backgroundColor: colors.primary[100],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  appBadgeText: { fontSize: 10, fontWeight: "700", color: colors.primary[600] },
  paradaTipo: {
    fontSize: 11,
    color: colors.text.muted,
    textTransform: "capitalize",
  },
  paradaDesc: { fontSize: 13, color: colors.text.secondary, lineHeight: 19 },
});
