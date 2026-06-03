import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function SearchFilterCard({ ciudad }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="location" size={18} color={colors.primary[500]} />
        <Text style={styles.location}>{ciudad}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.rowSplit}>
        <View style={styles.field}>
          <Ionicons
            name="calendar-outline"
            size={15}
            color={colors.primary[500]}
          />
          <Text style={styles.fieldText}>01 Jan - 10 Jan</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.field}>
          <Ionicons
            name="people-outline"
            size={15}
            color={colors.primary[500]}
          />
          <Text style={styles.fieldText}>2</Text>
        </View>
      </View>
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
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  location: { fontSize: 15, fontWeight: "600", color: colors.text.primary },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: 12,
  },
  rowSplit: { flexDirection: "row", alignItems: "center" },
  field: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  fieldText: { fontSize: 13, fontWeight: "500", color: colors.text.primary },
  verticalDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border.default,
    marginHorizontal: 8,
  },
});
