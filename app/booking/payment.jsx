import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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
import Divider from "../../components/ui/Divider";
import { reservaService } from "../../services/reserva.service";

const MOCK_CARDS = [
  {
    id: 1,
    tipo: "Visa",
    numero: "**** **** **** 4242",
    expiry: "12/26",
    icono: "card-outline",
  },
  {
    id: 2,
    tipo: "Mastercard",
    numero: "**** **** **** 5555",
    expiry: "08/25",
    icono: "card-outline",
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    total,
    hostalNombre,
    checkIn,
    checkOut,
    guests,
    id_habitacion,
    numRooms,
  } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(MOCK_CARDS[0]);

  const handlePay = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const reserva = await reservaService.createReserva({
        id_habitacion: Number(id_habitacion),
        fecha_inicio: checkIn,
        fecha_fin: checkOut,
        num_personas: Number(guests),
      });
      router.replace({
        pathname: "/booking/success",
        params: {
          hostalNombre,
          checkIn,
          checkOut,
          total,
          id_reserva: reserva.id_reserva,
        },
      });
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary[600]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hostal</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {hostalNombre}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dates</Text>
            <Text style={styles.summaryValue}>
              {checkIn} → {checkOut}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Guests</Text>
            <Text style={styles.summaryValue}>{guests}</Text>
          </View>
          <Divider />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total}€</Text>
          </View>
        </View>

        {/* Tarjetas */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {MOCK_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardOption,
              selectedCard.id === card.id && styles.cardOptionSelected,
            ]}
            onPress={() => setSelectedCard(card)}
          >
            <View style={styles.cardIcon}>
              <Ionicons
                name={card.icono}
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTipo}>{card.tipo}</Text>
              <Text style={styles.cardNumero}>{card.numero}</Text>
              <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
            </View>
            <View
              style={[
                styles.radio,
                selectedCard.id === card.id && styles.radioSelected,
              ]}
            >
              {selectedCard.id === card.id && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Seguridad */}
        <View style={styles.secureRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={colors.success}
          />
          <Text style={styles.secureText}>
            Your payment is secured with SSL encryption
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnDisabled]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.payBtnText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payBtnText}>Pay {total}€</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.text.primary },
  content: { padding: 16, paddingBottom: 20 },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: 24,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 13, color: colors.text.muted },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    maxWidth: "60%",
  },
  totalLabel: { fontSize: 16, fontWeight: "800", color: colors.text.primary },
  totalValue: { fontSize: 18, fontWeight: "800", color: colors.accent[500] },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  cardOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  cardOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[100],
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, gap: 2 },
  cardTipo: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
  cardNumero: { fontSize: 13, color: colors.text.secondary },
  cardExpiry: { fontSize: 12, color: colors.text.muted },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: colors.primary[500] },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  secureText: { fontSize: 12, color: colors.text.muted },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  payBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  payBtnDisabled: { backgroundColor: colors.text.muted },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  payBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
