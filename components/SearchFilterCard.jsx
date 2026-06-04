import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import DateRangeModal from "./DateRandeModal";
import GuestsModal from "./GuestsModal";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

export default function SearchFilterCard({
  ciudad,
  checkIn,
  checkOut,
  guests,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
}) {
  const [showDateModal, setShowDateModal] = useState(false);

  const [showGuestsModal, setShowGuestsModal] = useState(false);

  return (
    <View style={styles.card}>
      {/* Ubicación */}
      <View style={styles.row}>
        <Ionicons name="location" size={25} color={colors.primary[500]} />
        <Text style={styles.location}>{ciudad}</Text>
      </View>

      <View style={styles.divider} />

      {/* Fechas y guests */}
      <View style={styles.rowSplit}>
        <Pressable style={styles.field} onPress={() => setShowDateModal(true)}>
          <Ionicons name="calendar" size={25} color={colors.primary[500]} />
          <Text style={styles.fieldText}>
            {checkIn && checkOut
              ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
              : "Select dates"}
          </Text>
        </Pressable>

        <View style={styles.verticalDivider} />

        <Pressable
          style={styles.field}
          onPress={() => setShowGuestsModal(true)}
        >
          <Ionicons name="people" size={25} color={colors.primary[500]} />
          <Text style={styles.fieldText}>
            {guests} {guests === 1 ? "guest" : "guests"}
          </Text>
        </Pressable>
      </View>

      <DateRangeModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        checkIn={checkIn}
        checkOut={checkOut}
        onConfirm={(ci, co) => {
          onCheckInChange(ci);
          onCheckOutChange(co);
        }}
      />

      <GuestsModal
        visible={showGuestsModal}
        onClose={() => setShowGuestsModal(false)}
        guests={guests}
        onConfirm={onGuestsChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  location: { fontSize: 20, fontWeight: "600", color: colors.text.muted },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: 12,
  },
  rowSplit: {
    flexDirection: "row",
    alignItems: "center",
  },
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  fieldText: { fontSize: 16, fontWeight: "500", color: colors.text.secondary },
  verticalDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border.default,
    marginHorizontal: 8,
  },
});
