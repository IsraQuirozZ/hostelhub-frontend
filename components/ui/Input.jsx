import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";

export function Input({ label, error, iconName, ...props }) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={25}
            color={colors.text.muted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor={colors.text.muted}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.label,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary[400],
  },
  icon: { marginRight: 8, paddingBottom: 6 },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: colors.text.primary,
    paddingBottom: 6,
  },
  inputError: { borderBottomColor: colors.error },
  error: { fontSize: 12, color: colors.error, marginTop: 4 },
});
