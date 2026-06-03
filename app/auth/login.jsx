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

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Email inválido";
    if (password.length < 6) e.password = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Connect. Travel. Share.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Type your email"
            keyboardType="email-address"
            autoCapitalize="none"
            iconName="mail"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Type your password"
            secureTextEntry
            iconName="lock-closed"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgot}>Forgot your password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} loading={loading} />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background.light },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 48, gap: 15 },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.primary[600],
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, fontWeight: "700", color: colors.primary[400] },
  form: { width: "100%" },
  forgotWrapper: { alignSelf: "flex-end", marginBottom: 30, marginTop: -8 },
  forgot: { fontSize: 13, color: colors.accent[500] },
  registerRow: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  registerText: { fontSize: 14, color: colors.text.secondary },
  registerLink: {
    fontSize: 14,
    color: colors.accent[500],
    textDecorationLine: "underline",
  },
});
