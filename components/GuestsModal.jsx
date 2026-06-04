import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/colors";

export default function GuestsModal({ visible, onClose, guests, onConfirm }) {
  const [localGuests, setLocalGuests] = useState(guests ?? 1);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Guests</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.counter}>
            <TouchableOpacity
              style={[
                styles.counterBtn,
                localGuests === 1 && styles.counterBtnDisabled,
              ]}
              onPress={() => setLocalGuests(Math.max(1, localGuests - 1))}
            >
              <Ionicons
                name="remove"
                size={24}
                color={localGuests === 1 ? colors.text.muted : "#FFFFFF"}
              />
            </TouchableOpacity>

            <View style={styles.counterValue}>
              <Text style={styles.counterNumber}>{localGuests}</Text>
              <Text style={styles.counterLabel}>
                {localGuests === 1 ? "guest" : "guests"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.counterBtn}
              onPress={() => setLocalGuests(localGuests + 1)}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => {
              onConfirm(localGuests);
              onClose();
            }}
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
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
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginBottom: 32,
  },
  counterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: { backgroundColor: colors.border.default },
  counterValue: { alignItems: "center", minWidth: 60 },
  counterNumber: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.text.primary,
  },
  counterLabel: { fontSize: 14, color: colors.text.muted },
  confirmBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  confirmBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
