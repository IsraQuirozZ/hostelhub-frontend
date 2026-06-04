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
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { Input } from "../../components/ui/Input";
import ButtonFull from "../../components/ui/ButtonFull";
import { postService } from "../../services/post.service";
import { hostelService } from "../../services/hostel.service";

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  const [cities, setCities] = useState([]);

  //   Ciudad
  const [selectedCity, setSelectedCity] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    nombre_lugar: "",
    foto_url: "",
    promedio_rating: "0",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    hostelService.getCities().then(setCities).catch(console.error);
  }, []);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio";
    if (!form.contenido.trim()) e.contenido = "El contenido es obligatorio";
    if (!selectedCity && !citySearch.trim())
      e.ciudad = "Selecciona o escribe una ciudad";
    if (
      form.promedio_rating &&
      (Number(form.promedio_rating) < 0 || Number(form.promedio_rating) > 5)
    ) {
      e.promedio_rating = "El rating debe estar entre 0 y 5";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    console.log(form);
    if (!validate()) return;
    setSaving(true);
    try {
      await postService.createPost({
        titulo: form.titulo.trim(),
        contenido: form.contenido.trim(),

        ...(selectedCity?.isNew
          ? { nombre_ciudad: selectedCity.nombre }
          : { id_ciudad: selectedCity?.id_ciudad }),

        nombre_lugar: form.nombre_lugar || undefined,
        foto_url: form.foto_url || undefined,
        promedio_rating: Number(form.promedio_rating),
      });
      router.push("/(tabs)/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={"#FFF"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="Title"
          iconName="pencil-outline"
          placeholder="Give your post a title"
          value={form.titulo}
          onChangeText={set("titulo")}
          error={errors.titulo}
        />

        <Input
          label="Description"
          iconName="document-text-outline"
          placeholder="Tell us about your experience..."
          value={form.contenido}
          onChangeText={set("contenido")}
          multiline
          numberOfLines={4}
          error={errors.contenido}
        />

        {/* City picker */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>City</Text>
          <View
            style={[styles.fieldBtn, errors.ciudad && styles.fieldBtnError]}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color={colors.text.muted}
            />
            <TextInput
              style={[styles.fieldText, { paddingBottom: 0 }]}
              placeholder="Search or add a city..."
              placeholderTextColor={colors.text.muted}
              value={citySearch}
              onChangeText={(text) => {
                setCitySearch(text);
                setSelectedCity(null);
                setShowCityPicker(true);
              }}
              onFocus={() => setShowCityPicker(true)}
            />
            {citySearch.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setCitySearch("");
                  setSelectedCity(null);
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.text.muted}
                />
              </TouchableOpacity>
            )}
          </View>
          {errors.ciudad && (
            <Text style={styles.errorText}>{errors.ciudad}</Text>
          )}

          {showCityPicker && (
            <View style={styles.cityList}>
              {/* Ciudades filtradas */}
              {cities
                .filter((c) =>
                  c.nombre.toLowerCase().includes(citySearch.toLowerCase()),
                )
                .map((city) => (
                  <TouchableOpacity
                    key={city.id_ciudad}
                    style={[
                      styles.cityItem,
                      selectedCity?.id_ciudad === city.id_ciudad &&
                        styles.cityItemActive,
                    ]}
                    onPress={() => {
                      setSelectedCity(city);
                      setCitySearch(city.nombre);
                      setShowCityPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.cityItemText,
                        selectedCity?.id_ciudad === city.id_ciudad &&
                          styles.cityItemTextActive,
                      ]}
                    >
                      {city.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}

              {/* Añadir nueva ciudad */}
              {citySearch.trim().length > 0 &&
                !cities.find(
                  (c) => c.nombre.toLowerCase() === citySearch.toLowerCase(),
                ) && (
                  <TouchableOpacity
                    style={styles.cityItemNew}
                    onPress={() => {
                      const cityName = citySearch.trim();

                      setSelectedCity({
                        nombre: cityName,
                        isNew: true,
                      });

                      setShowCityPicker(false);
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={16}
                      color={colors.primary[500]}
                    />
                    <Text style={styles.cityItemNewText}>
                      Add "{citySearch.trim()}"
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </View>

        <Input
          label="Place name (optional)"
          iconName="pin-outline"
          placeholder="e.g. Eiffel Tower"
          value={form.nombre_lugar}
          onChangeText={set("nombre_lugar")}
        />

        <Input
          label="Photo URL (optional)"
          iconName="image-outline"
          placeholder="https://..."
          value={form.foto_url}
          onChangeText={set("foto_url")}
          autoCapitalize="none"
        />

        {/* Rating */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>Rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => set("promedio_rating")(String(star))}
              >
                <Ionicons
                  name="star"
                  size={32}
                  color={
                    Number(form.promedio_rating) >= star ? "#F0B429" : "#E5E0D8"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
          {errors.promedio_rating && (
            <Text style={styles.errorText}>{errors.promedio_rating}</Text>
          )}
        </View>

        <ButtonFull
          title="Publish Post"
          onPress={handleSubmit}
          loading={saving}
        />
      </ScrollView>
    </View>
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
  content: { padding: 20, gap: 4 },

  fieldWrapper: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  fieldBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary[400],
    paddingBottom: 8,
  },
  fieldBtnError: { borderBottomColor: colors.error },
  fieldText: { flex: 1, fontSize: 15, color: colors.text.primary },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },

  cityList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginTop: 8,
    overflow: "hidden",
  },
  cityItem: { paddingVertical: 12, paddingHorizontal: 16 },
  cityItemActive: { backgroundColor: colors.primary[100] },
  cityItemText: { fontSize: 14, color: colors.text.primary },
  cityItemTextActive: { color: colors.primary[600], fontWeight: "700" },
  cityItemNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  cityItemNewText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: "600",
  },

  starsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
});
