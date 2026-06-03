import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export default function FavoritosScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="heart-outline" size={48} color={colors.text.muted} />
      <Text style={styles.title}>Sin favoritos aún</Text>
      <Text style={styles.subtitle}>
        Los hostales que guardes aparecerán aquí
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.light,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
