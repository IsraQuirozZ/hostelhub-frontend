import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/colors";

export default function ButtonFull({ title, onPress, loading, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#0B1220",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  pressed: { opacity: 0.7 },
  text: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
