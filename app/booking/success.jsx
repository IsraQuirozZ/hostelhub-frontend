import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { useEffect, useState } from "react";
import { reservaService } from "../../services/reserva.service";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function BookingSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hostalNombre, checkIn, checkOut, total, id_reserva } =
    useLocalSearchParams();
  const [estado, setEstado] = useState("pendiente");
  const [confirmando, setConfirmando] = useState(true);

  useEffect(() => {
    const confirmar = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        await reservaService.confirmarReserva(id_reserva);
        setEstado("confirmada");
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmando(false);
      }
    };
    confirmar();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Icono */}
        <View style={styles.iconWrapper}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your reservation has been successfully completed.
        </Text>

        {/* Detalles */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons
              name="bed-outline"
              size={18}
              color={colors.primary[500]}
            />
            <Text style={styles.cardLabel}>Hostal</Text>
            <Text style={styles.cardValue}>{hostalNombre}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.primary[500]}
            />
            <Text style={styles.cardLabel}>Check in</Text>
            <Text style={styles.cardValue}>{formatDate(checkIn)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.primary[500]}
            />
            <Text style={styles.cardLabel}>Check out</Text>
            <Text style={styles.cardValue}>{formatDate(checkOut)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Ionicons
              name="card-outline"
              size={18}
              color={colors.primary[500]}
            />
            <Text style={styles.cardLabel}>Total paid</Text>
            <Text style={styles.totalValue}>{total}€</Text>
          </View>

          <View style={styles.cardRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={colors.primary[500]}
            />
            <Text style={styles.cardLabel}>Status</Text>
            {confirmando ? (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" color={colors.warning} />
                <Text style={styles.statusPending}>Confirming...</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.cardValue,
                  { color: colors.success, fontWeight: "700" },
                ]}
              >
                {estado}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Botones */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/(tabs)/reservas")}
        >
          <Text style={styles.primaryBtnText}>View My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E8F8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  cardLabel: { fontSize: 14, color: colors.text.muted, flex: 1 },
  cardValue: { fontSize: 14, fontWeight: "600", color: colors.text.primary },
  totalValue: { fontSize: 16, fontWeight: "800", color: colors.accent[500] },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: 8,
  },
  footer: { padding: 16, gap: 10 },
  primaryBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  secondaryBtnText: {
    color: colors.text.secondary,
    fontWeight: "600",
    fontSize: 15,
  },

  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusPending: { fontSize: 14, color: colors.warning, fontWeight: "600" },
});
