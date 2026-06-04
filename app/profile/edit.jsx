import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import api from "../../services/api";
import ButtonFull from "../../components/ui/ButtonFull";
import { Input } from "../../components/ui/Input";
import CountryPicker from "react-native-country-picker-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { userService } from "../../services/user.service";

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    sobre_mi: "",
    nacionalidad: "",
    fecha_nacimiento: "",
  });

  //   Nacionalidad
  const [countryCode, setCountryCode] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  //   Fecha Nacimiento
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Lenguajes
  const [myLanguages, setMyLanguages] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("basico");
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const LEVEL_LABELS = {
    basico: "Básico",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    nativo: "Nativo",
  };

  useEffect(() => {
    api
      .get("/users/me")
      .then(({ data }) => {
        const u = data.data;
        setForm({
          nombre: u.nombre ?? "",
          sobre_mi: u.sobre_mi ?? "",
          nacionalidad: u.nacionalidad ?? "",
          fecha_nacimiento: u.fecha_nacimiento
            ? u.fecha_nacimiento.split("T")[0]
            : "",
        });
        if (u.nacionalidad) {
          setCountryCode("");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    userService.getMyLanguages().then(setMyLanguages).catch(console.error);
    userService.getAllLanguages().then(setAllLanguages).catch(console.error);
  }, []);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/users/me", form);
      router.push("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="arrow-back" size={25} color={"#FFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="Full Name"
          iconName="person"
          value={form.nombre}
          onChangeText={set("nombre")}
        />
        <Input
          label="About me"
          iconName="document-text"
          value={form.sobre_mi}
          onChangeText={set("sobre_mi")}
          multiline
          numberOfLines={3}
        />

        {/* Nacionalidad */}
        <View style={styles.countryWrapper}>
          <Text style={styles.countryLabel}>Nationality</Text>
          <TouchableOpacity
            style={styles.countryBtn}
            onPress={() => setShowCountryPicker(true)}
          >
            <Ionicons
              name="globe-outline"
              size={18}
              color={colors.text.muted}
            />
            <Text
              style={[
                styles.countryText,
                !form.nacionalidad && styles.countryPlaceholder,
              ]}
            >
              {form.nacionalidad || "Select your country"}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
          </TouchableOpacity>
          <View style={{ height: 0, overflow: "hidden" }}>
            <CountryPicker
              visible={showCountryPicker}
              onClose={() => setShowCountryPicker(false)}
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setForm((f) => ({ ...f, nacionalidad: country.name }));
                setShowCountryPicker(false);
              }}
              withSearch
              withFlag
              withFilter
              countryCode={countryCode || undefined}
            />
          </View>
        </View>

        {/* Fecha Nacimiento */}
        <View style={styles.countryWrapper}>
          <Text style={styles.countryLabel}>Date of birth</Text>
          <TouchableOpacity
            style={styles.countryBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.text.muted}
            />
            <Text
              style={[
                styles.countryText,
                !form.fecha_nacimiento && styles.countryPlaceholder,
              ]}
            >
              {form.fecha_nacimiento || "Select your date of birth"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <>
              <DateTimePicker
                value={
                  form.fecha_nacimiento
                    ? new Date(form.fecha_nacimiento)
                    : new Date(2000, 0, 1)
                }
                mode="date"
                maximumDate={new Date()}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  if (Platform.OS === "android") setShowDatePicker(false);
                  if (date) {
                    setForm((f) => ({
                      ...f,
                      fecha_nacimiento: date.toISOString().split("T")[0],
                    }));
                  }
                }}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Lenguajes */}
        <View style={styles.languagesSection}>
          <Text style={styles.countryLabel}>Languages</Text>

          {/* Mis idiomas como tags */}
          <View style={styles.tagsRow}>
            {myLanguages.map(({ idioma, nivel }) => (
              <View key={idioma.codigo_iso} style={styles.tag}>
                <Text style={styles.tagText}>{idioma.nombre}</Text>
                <Text style={styles.tagLevel}>{nivel}</Text>
                <TouchableOpacity
                  onPress={async () => {
                    await userService.removeLanguage(idioma.codigo_iso);
                    setMyLanguages((prev) =>
                      prev.filter(
                        (l) => l.idioma.codigo_iso !== idioma.codigo_iso,
                      ),
                    );
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={colors.accent[500]}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.tagAdd}
              onPress={() => setShowLanguagePicker(true)}
            >
              <Ionicons name="add" size={20} color={colors.accent[500]} />
              <Text style={styles.tagAddText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Picker de idiomas */}
          {showLanguagePicker && (
            <View style={styles.pickerCard}>
              <Text style={styles.pickerTitle}>Select language</Text>
              {allLanguages
                .filter(
                  (l) =>
                    !myLanguages.find(
                      (ml) => ml.idioma.codigo_iso === l.codigo_iso,
                    ),
                )
                .map((lang) => (
                  <TouchableOpacity
                    key={lang.codigo_iso}
                    style={[
                      styles.pickerItem,
                      selectedLanguage?.codigo_iso === lang.codigo_iso &&
                        styles.pickerItemActive,
                    ]}
                    onPress={() => setSelectedLanguage(lang)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedLanguage?.codigo_iso === lang.codigo_iso &&
                          styles.pickerItemTextActive,
                      ]}
                    >
                      {lang.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}

              <Text style={[styles.countryLabel, { marginTop: 12 }]}>
                Level
              </Text>
              <View style={styles.levelsRow}>
                {["basico", "intermedio", "avanzado", "nativo"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelBtn,
                      selectedLevel === level && styles.levelBtnActive,
                    ]}
                    onPress={() => setSelectedLevel(level)}
                  >
                    <Text
                      style={[
                        styles.levelBtnText,
                        selectedLevel === level && styles.levelBtnTextActive,
                      ]}
                    >
                      {LEVEL_LABELS[level]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.pickerActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setShowLanguagePicker(false);
                    setSelectedLanguage(null);
                  }}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    !selectedLanguage && styles.confirmBtnDisabled,
                  ]}
                  onPress={async () => {
                    if (!selectedLanguage) return;
                    try {
                      await userService.addLanguage(
                        selectedLanguage.codigo_iso,
                        selectedLevel,
                      );
                      setMyLanguages((prev) => [
                        ...prev,
                        { idioma: selectedLanguage, nivel: selectedLevel },
                      ]);
                      setShowLanguagePicker(false);
                      setSelectedLanguage(null);
                    } catch (err) {
                      console.log("Error adding language:", err.message);
                    }
                  }}
                >
                  <Text style={styles.confirmBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <ButtonFull
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  content: { padding: 20, gap: 4 },

  //   Nacionalidad
  countryWrapper: { marginBottom: 20 },
  countryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary[400],
    paddingBottom: 8,
  },
  countryText: { flex: 1, fontSize: 15, color: colors.text.primary },
  countryPlaceholder: { color: colors.text.muted },
  // Fecha Nacimiento
  doneBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    marginTop: 4,
  },
  doneBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },

  // Lenguajes
  languagesSection: { marginBottom: 20 },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent[500],
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tagText: { fontSize: 16, fontWeight: "600", color: colors.accent[500] },
  tagLevel: { fontSize: 11, color: colors.accent[300] },
  tagAdd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.accent[500],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderStyle: "dashed",
  },
  tagAddText: { fontSize: 13, color: colors.accent[500], fontWeight: "600" },
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 10,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  pickerItemActive: { backgroundColor: colors.primary[100] },
  pickerItemText: { fontSize: 14, color: colors.text.primary },
  pickerItemTextActive: { color: colors.primary[600], fontWeight: "700" },
  levelsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  levelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  levelBtnActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  levelBtnText: { fontSize: 14, color: colors.text.secondary },
  levelBtnTextActive: { color: "#FFFFFF", fontWeight: "600" },
  pickerActions: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 14, color: colors.text.secondary },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.primary[500],
    alignItems: "center",
  },
  confirmBtnDisabled: { backgroundColor: colors.text.muted },
  confirmBtnText: { fontSize: 14, color: "#FFFFFF", fontWeight: "700" },
});
