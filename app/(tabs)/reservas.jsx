import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { reservaService } from "../../services/reserva.service";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ReservasScreen() {
  const insets = useSafeAreaInsets();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservaService
      .getMyReservas()
      .then(setReservas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {reservas.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={colors.text.muted}
          />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Your reservations will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {reservas.map((reserva) => {
            const hab = reserva.habitaciones?.[0]?.habitacion;
            return (
              <View key={reserva.id_reserva} style={styles.card}>
                {/* Hostal info */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <Ionicons name="bed-outline" size={25} color={"#ffffff"} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.hostalNombre}>
                      {hab?.hostal?.nombre}
                    </Text>
                    <View style={styles.row}>
                      <Ionicons
                        name="location-outline"
                        size={12}
                        color={colors.text.muted}
                      />
                      <Text style={styles.ciudad}>
                        {hab?.hostal?.ciudad?.nombre}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      reserva.estado === "confirmada"
                        ? styles.badgeConfirmada
                        : styles.badgePendiente,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color:
                            reserva.estado === "confirmada"
                              ? colors.success
                              : colors.warning,
                        },
                      ]}
                    >
                      {reserva.estado}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Detalles */}
                <View style={styles.details}>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={colors.text.muted}
                    />
                    <Text style={styles.detailText}>
                      {formatDate(reserva.fecha_inicio)}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={colors.text.muted}
                    />
                    <Text style={styles.detailText}>
                      {formatDate(reserva.fecha_fin)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="people-outline"
                      size={14}
                      color={colors.text.muted}
                    />
                    <Text style={styles.detailText}>
                      {reserva.num_personas} guests
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="home-outline"
                      size={14}
                      color={colors.text.muted}
                    />
                    <Text style={styles.detailText}>{hab?.tipo}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total pagado</Text>
                  <Text style={styles.totalValue}>{reserva.total}€</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: colors.text.primary },
  list: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.text.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, gap: 4 },
  hostalNombre: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  ciudad: { fontSize: 12, color: colors.text.muted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeConfirmada: { backgroundColor: "#E8F8F0" },
  badgePendiente: { backgroundColor: colors.warning + "33" },
  badgeText: { fontSize: 11, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: 12,
  },
  details: { gap: 8 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13, color: colors.text.secondary },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 14, color: colors.text.muted },
  totalValue: { fontSize: 16, fontWeight: "800", color: colors.primary[600] },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  emptyText: { fontSize: 14, color: colors.text.muted },
});
