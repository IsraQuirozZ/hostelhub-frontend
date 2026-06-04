import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import Divider from "../../components/ui/Divider";
import { useState } from "react";
import DateRangeModal from "../../components/DateRandeModal";
import GuestsModal from "../../components/GuestsModal";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function BookingConfirmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    hostalNombre,
    hostalCiudad,
    habitacionTipo,
    habitacionPrecio,
    checkIn,
    checkOut,
    guests,
    numRooms,
    total,
    id_habitacion,
    id_hostal,
  } = useLocalSearchParams();

  const [localCheckIn, setLocalCheckIn] = useState(checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(checkOut);
  const [localGuests, setLocalGuests] = useState(Number(guests));
  const [showDateModal, setShowDateModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [localTotal, setLocalTotal] = useState(Number(total));

  const getNights = () => {
    const diff = new Date(localCheckOut) - new Date(localCheckIn);
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  const recalcTotal = (ci, co, g) => {
    const nights = Math.round(
      (new Date(co) - new Date(ci)) / (1000 * 60 * 60 * 24),
    );
    const rooms = Math.ceil(g / Number(numRooms));
    setLocalTotal(Number(habitacionPrecio) * nights * rooms);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={"#FFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify & Continue</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hostal card */}
        <View style={styles.hostalCard}>
          <View style={styles.hostalImg}>
            <Ionicons name="bed-outline" size={60} color={"#FFFFFF"} />
          </View>
          <View style={styles.hostalInfo}>
            <Text style={styles.hostalNombre}>{hostalNombre}</Text>
            <View style={styles.row}>
              <Ionicons name="star" size={18} color="#F0B429" />
              <Text style={styles.hostalMeta}>{hostalCiudad}</Text>
              <Text style={styles.hostalReviews}>- 0 Reviews</Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Fechas */}
        <View style={styles.detailRow}>
          <View>
            <Text style={styles.detailLabel}>Dates</Text>
            <Text style={styles.detailValue}>
              {formatDate(localCheckIn)} - {formatDate(localCheckOut)}
            </Text>
            <Text style={styles.detailSub}>{getNights()} nights</Text>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => setShowDateModal(true)}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Guests */}
        <View style={styles.detailRow}>
          <View>
            <Text style={styles.detailLabel}>Guests</Text>
            <Text style={styles.detailValue}>
              {localGuests} {localGuests === 1 ? "Adult" : "Adults"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => setShowGuestsModal(true)}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Total */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>{localTotal}€</Text>
        </View>

        {/* Non-refundable banner */}
        <View style={styles.banner}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#92400E"
          />
          <Text style={styles.bannerText}>
            This reservation is non-refundable
          </Text>
        </View>

        <Divider />

        {/* Payment */}
        <Text style={styles.paymentTitle}>Payment</Text>
        <TouchableOpacity style={styles.paymentOption}>
          <Ionicons name="card" size={25} color={colors.primary[500]} />
          <Text style={styles.paymentText}>Pay {total}€ Now</Text>
          <View style={styles.paymentCheck}>
            <View style={styles.paymentCheckInner} />
          </View>
        </TouchableOpacity>

        <DateRangeModal
          visible={showDateModal}
          onClose={() => setShowDateModal(false)}
          checkIn={localCheckIn}
          checkOut={localCheckOut}
          onConfirm={(ci, co) => {
            setLocalCheckIn(ci);
            setLocalCheckOut(co);
            recalcTotal(ci, co, localGuests);
          }}
        />

        <GuestsModal
          visible={showGuestsModal}
          onClose={() => setShowGuestsModal(false)}
          guests={localGuests}
          onConfirm={(g) => {
            setLocalGuests(g);
            recalcTotal(localCheckIn, localCheckOut, g);
          }}
        />
      </ScrollView>

      {/* Footer fijo */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() =>
            router.push({
              pathname: "/booking/payment",
              params: {
                total: String(localTotal),
                hostalNombre,
                checkIn,
                checkOut,
                guests,
                id_habitacion,
                id_hostal,
                numRooms,
              },
            })
          }
        >
          <Text style={styles.nextBtnText}>Next</Text>
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
  content: { padding: 16, paddingBottom: 20 },

  // Hostal card
  hostalCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  hostalImg: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.text.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  hostalInfo: { flex: 1, gap: 4 },
  hostalNombre: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text.primary,
    marginTop: 4,
    marginBottom: 6,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  hostalMeta: { fontSize: 16, color: colors.text.primary, fontWeight: "600" },
  hostalReviews: { fontSize: 14, color: colors.text.muted, fontWeight: "500" },

  // Detail rows
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  detailValue: { fontSize: 16, color: colors.text.muted },
  detailSub: { fontSize: 12, color: colors.text.muted, marginTop: 2 },
  changeBtn: {
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary[500],
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.accent[500],
  },

  // Banner
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.warning,
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  bannerText: {
    fontSize: 13,
    color: colors.warningText,
    fontWeight: "500",
    flex: 1,
  },

  // Payment
  paymentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary[400],
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary[500],
  },
  paymentCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  paymentCheckInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  nextBtn: {
    backgroundColor: colors.accent[500],
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  nextBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 20 },
});
