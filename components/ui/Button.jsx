import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../constants/colors";

export function Button({
  title,
  onPress,
  loading,
  variant = "primary",
  disabled,
}) {
  const isOutline = variant === "outline";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isOutline ? styles.outline : styles.primary,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? colors.primary[500] : colors.text.inverse}
        />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  primary: { backgroundColor: colors.primary[600] },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  pressed: { opacity: 0.7 },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.inverse,
    letterSpacing: 0.3,
  },
  textOutline: { color: colors.primary[500] },
});
