import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (form.nombre.trim().length < 2) e.nombre = "Nombre demasiado corto";
    if (!form.email.includes("@")) e.email = "Email inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.repeatPassword)
      e.repeatPassword = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.nombre.trim(), form.email.trim(), form.password);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>HH</Text>
          </View>
          <Text style={styles.title}>
            Join <Text style={styles.titleBold}>HostelHub</Text>
          </Text>
          <Text style={styles.subtitle}>
            Find the best hostels and meet travelers around the world.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Type your full name"
            iconName="person"
            value={form.nombre}
            onChangeText={set("nombre")}
            error={errors.nombre}
          />
          <Input
            label="Email"
            placeholder="Type your email"
            keyboardType="email-address"
            autoCapitalize="none"
            iconName="mail"
            value={form.email}
            onChangeText={set("email")}
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Type your password"
            secureTextEntry
            iconName="lock-closed"
            value={form.password}
            onChangeText={set("password")}
            error={errors.password}
          />
          <Input
            label="Repeat Password"
            placeholder="Repeat your password"
            secureTextEntry
            iconName="lock-closed"
            value={form.repeatPassword}
            onChangeText={set("repeatPassword")}
            error={errors.repeatPassword}
          />

          <Button title="Register" onPress={handleRegister} loading={loading} />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>You have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background.light },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: "center" },
  logoWrapper: { alignItems: "center", marginBottom: 32 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.accent[500],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary[600],
    marginBottom: 6,
  },
  titleBold: { fontWeight: "800", color: colors.text.primary },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary[400],
    textAlign: "center",
    lineHeight: 20,
  },
  form: { width: "100%" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  loginText: { fontSize: 14, color: colors.text.secondary },
  loginLink: {
    fontSize: 14,
    color: colors.accent[500],
    textDecorationLine: "underline",
  },
});
