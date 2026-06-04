import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { colors } from "../constants/colors";
import { useState } from "react";

export default function DateRangeModal({
  visible,
  onClose,
  checkIn,
  checkOut,
  onConfirm,
}) {
  const [localCheckIn, setLocalCheckIn] = useState(checkIn ?? "");
  const [localCheckOut, setLocalCheckOut] = useState(checkOut ?? "");
  const [markedDates, setMarkedDates] = useState({});

  const formatLongDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}. ${year}`;
  };

  const handleDayPress = (day) => {
    if (!localCheckIn || (localCheckIn && localCheckOut)) {
      setLocalCheckIn(day.dateString);
      setLocalCheckOut("");
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: colors.accent[500],
          textColor: "#fff",
        },
      });
    } else {
      if (day.dateString < localCheckIn) {
        setLocalCheckIn(day.dateString);
        setMarkedDates({
          [day.dateString]: {
            startingDay: true,
            color: colors.accent[500],
            textColor: "#fff",
          },
        });
        return;
      }
      setLocalCheckOut(day.dateString);
      const range = {};
      let current = new Date(localCheckIn);
      const end = new Date(day.dateString);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        range[dateStr] = {
          color:
            dateStr === localCheckIn || dateStr === day.dateString
              ? colors.accent[500]
              : colors.accent[300],
          textColor: "#fff",
          startingDay: dateStr === localCheckIn,
          endingDay: dateStr === day.dateString,
        };
        current.setDate(current.getDate() + 1);
      }
      setMarkedDates(range);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Select dates</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={25} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markingType="period"
            markedDates={markedDates}
            minDate={new Date().toISOString().split("T")[0]}
            theme={{
              todayTextColor: colors.primary[500],
              arrowColor: colors.primary[500],
            }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {localCheckIn && localCheckOut
                ? `${formatLongDate(localCheckIn)} → ${formatLongDate(localCheckOut)}`
                : localCheckIn
                  ? "Select checkout date"
                  : "Select checkin date"}
            </Text>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                (!localCheckIn || !localCheckOut) && styles.confirmBtnDisabled,
              ]}
              disabled={!localCheckIn || !localCheckOut}
              onPress={() => {
                onConfirm(localCheckIn, localCheckOut);
                onClose();
              }}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  footer: { marginTop: 16, gap: 12 },
  footerText: { fontSize: 14, color: colors.text.muted, textAlign: "center" },
  confirmBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  confirmBtnDisabled: { backgroundColor: colors.text.muted },
  confirmBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
