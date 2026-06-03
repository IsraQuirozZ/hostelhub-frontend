import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.nombre ?? "Usuario"}</Text>
      <Text style={styles.email}>{user?.email ?? ""}</Text>

      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.light,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary[600],
    marginBottom: 4,
  },
  email: { fontSize: 14, color: colors.text.muted, marginBottom: 40 },
  btn: {
    backgroundColor: colors.accent[500],
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  btnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
