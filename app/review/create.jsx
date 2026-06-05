import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { reviewService } from "../../services/review.service";

export default function CreateReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id_hostal, hostalNombre } = useLocalSearchParams();

  const [puntuacion, setPuntuacion] = useState(5);
  const [contenido, setContenido] = useState("");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!contenido.trim()) return;
    setSaving(true);
    setError("");
    try {
      await reviewService.createReview(id_hostal, { puntuacion, contenido });
      router.back();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={25} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave a Review</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hostal */}
          <View style={styles.hostalCard}>
            <View style={styles.hostalIcon}>
              <Ionicons
                name="bed-outline"
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <Text style={styles.hostalNombre}>{hostalNombre}</Text>
          </View>

          {/* Estrellas */}
          <Text style={styles.label}>Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setPuntuacion(star)}>
                <Ionicons
                  name="star"
                  size={40}
                  color={puntuacion >= star ? "#F0B429" : "#E5E0D8"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {["", "Terrible", "Bad", "OK", "Good", "Excellent"][puntuacion]}
          </Text>

          {/* Contenido */}
          <Text style={styles.label}>Your experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Tell other travelers about your stay..."
            placeholderTextColor={colors.text.muted}
            value={contenido}
            onChangeText={setContenido}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </ScrollView>

        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!contenido.trim() || saving) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!contenido.trim() || saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0000004a",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.primary[600] },
  content: { padding: 20, gap: 16 },
  hostalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  hostalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  hostalNombre: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  label: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginVertical: 8,
  },
  ratingLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary[500],
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border.default,
    padding: 14,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 150,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  submitBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  submitBtnDisabled: { backgroundColor: colors.text.muted },
  submitBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE8E8",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  errorText: { fontSize: 13, color: colors.error, flex: 1 },
});
