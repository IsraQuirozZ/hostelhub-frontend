import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { reservaService } from "../../services/reserva.service";
import { reviewService } from "../../services/review.service";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { useRouter } from "expo-router";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ReservasScreen() {
  const router = useRouter();

  const swipeableRefs = useRef({});
  const insets = useSafeAreaInsets();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    puntuacion: 5,
    contenido: "",
  });
  const [savingReview, setSavingReview] = useState(false);

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

  const handleReview = async () => {
    setSavingReview(true);
    try {
      await reviewService.createReview(
        selectedReserva.habitaciones[0].habitacion.hostal.id_hostal,
        reviewForm,
      );
      setShowReviewModal(false);
      setReviewForm({ puntuacion: 5, contenido: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingReview(false);
    }
  };

  const renderRightActions = (reserva) => {
    const estado = reserva.estado?.toLowerCase();
    if (estado === "pendiente" || estado === "cancelada") return null;

    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.swipeAction, styles.swipeActionRuta]}
          onPress={() =>
            router.push({
              pathname: `/ruta/${reserva.id_reserva}`,
              params: { id_reserva: reserva.id_reserva },
            })
          }
        >
          <Ionicons name="map-outline" size={22} color="#FFFFFF" />
          <Text style={styles.swipeActionText}>Route</Text>
        </TouchableOpacity>

        {reserva.estado === "completada" && (
          <TouchableOpacity
            style={[styles.swipeAction, styles.swipeActionReview]}
            onPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              const hab = reserva.habitaciones?.[0]?.habitacion;
              router.push({
                pathname: "/review/create",
                params: {
                  id_hostal: String(hab?.hostal?.id_hostal),
                  hostalNombre: hab?.hostal?.nombre,
                },
              });
            }}
          >
            <Ionicons name="star-outline" size={22} color="#FFFFFF" />
            <Text style={styles.swipeActionText}>Review</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            onScrollBeginDrag={() => {
              Object.values(swipeableRefs.current).forEach((ref) =>
                ref?.close(),
              );
            }}
          >
            {reservas.map((reserva) => {
              const hab = reserva.habitaciones?.[0]?.habitacion;
              const estado = (reserva.estado || "").toLowerCase();
              const isConfirmada = estado === "confirmada";
              const isCompletada = estado === "completada";
              return (
                <Swipeable
                  key={reserva.id_reserva}
                  ref={(ref) => {
                    swipeableRefs.current[reserva.id_reserva] = ref;
                  }}
                  renderRightActions={() => renderRightActions(reserva)}
                  onSwipeableOpen={() => {
                    Object.entries(swipeableRefs.current).forEach(
                      ([key, ref]) => {
                        if (String(key) !== String(reserva.id_reserva))
                          ref?.close();
                      },
                    );
                  }}
                >
                  <View key={reserva.id_reserva} style={styles.card}>
                    {/* Hostal info */}
                    <View style={styles.cardHeader}>
                      <View style={styles.cardIcon}>
                        <Ionicons
                          name="bed-outline"
                          size={25}
                          color={"#ffffff"}
                        />
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
                          isCompletada
                            ? styles.badgeCompletada
                            : isConfirmada
                              ? styles.badgeConfirmada
                              : styles.badgePendiente,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            {
                              color: isCompletada
                                ? colors.success
                                : isConfirmada
                                  ? colors.info
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
                </Swipeable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.primary[600] },
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
  badgeConfirmada: { backgroundColor: colors.info + "22" },
  badgeCompletada: { backgroundColor: colors.success + "22" },
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

  // Swipe
  swipeActions: {
    flexDirection: "row",
    gap: 8,
    // alignItems: "center",
    marginLeft: 8,
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 16,
    gap: 4,
  },
  swipeActionRuta: { backgroundColor: colors.primary[500] },
  swipeActionReview: { backgroundColor: colors.accent[500] },
  swipeActionText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
});
