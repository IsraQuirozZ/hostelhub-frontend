import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { hostelService } from "../../services/hostel.service";
import Divider from "../../components/ui/Divider";
import ButtonFull from "../../components/ui/ButtonFull";
import MapPlaceholder from "../../components/MapPlaceHolder";
import { Calendar } from "react-native-calendars";
import ReviewCard from "../../components/ReviewCard";

const { width } = Dimensions.get("window");

const HOSTEL_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
  "https://images.unsplash.com/photo-1520277739336-7bf67430bd9c?w=800",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
];

const MAX_SERVICES_PREVIEW = 4;

export default function HostelDetailScreen() {
  const { id, checkInParam, checkOutParam, guestsParam } =
    useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [showAllServices, setShowAllServices] = useState(false);

  // Calendar
  const [checkIn, setCheckIn] = useState(checkInParam ?? "");
  const [checkOut, setCheckOut] = useState(checkOutParam ?? "");
  const [guests, setGuests] = useState(guestsParam ? Number(guestsParam) : 2);
  const [markedDates, setMarkedDates] = useState({});

  const services = hostel?.servicios ?? [];
  const hasMoreThanPreview = services.length > MAX_SERVICES_PREVIEW;
  const visibleServices = showAllServices
    ? services
    : services.slice(0, MAX_SERVICES_PREVIEW);

  useEffect(() => {
    hostelService
      .getHostelById(id)
      .then(setHostel)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  // Calendar
  const handleDayPress = (day) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day.dateString);
      setCheckOut("");
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: colors.accent[400],
          textColor: "#fff",
        },
      });
    } else {
      if (day.dateString < checkIn) {
        setCheckIn(day.dateString);
        setMarkedDates({
          [day.dateString]: {
            startingDay: true,
            color: colors.accent[400],
            textColor: "#fff",
          },
        });
        return;
      }
      setCheckOut(day.dateString);
      const range = {};
      let current = new Date(checkIn);
      const end = new Date(day.dateString);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        range[dateStr] = {
          color:
            dateStr === checkIn
              ? colors.accent[400]
              : dateStr === day.dateString
                ? colors.accent[400]
                : colors.accent[300],
          textColor: "#fff",
          startingDay: dateStr === checkIn,
          endingDay: dateStr === day.dateString,
        };
        current.setDate(current.getDate() + 1);
      }
      setMarkedDates(range);
    }
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.heroWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImage(index);
            }}
            scrollEventThrottle={16}
          >
            {HOSTEL_IMAGES.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {HOSTEL_IMAGES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeImage && styles.dotActive]}
              />
            ))}
          </View>

          <View style={[styles.heroButtons, { top: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <View style={styles.heroRight}>
              <TouchableOpacity style={styles.heroBtn}>
                <Ionicons
                  name="share-outline"
                  size={20}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroBtn}>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.nombre}>{hostel?.nombre}</Text>
          <View style={styles.infoRow}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.primary[500]} />
              <Text style={styles.ciudad}>{hostel?.ciudad?.nombre}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons
                name="star"
                size={16}
                color="#F0B429"
                style={{ marginLeft: 12 }}
              />
              <Text style={styles.rating}>{hostel?.promedio_rating}</Text>
              <Text style={styles.reviews}>
                ({hostel?.ratings?.length ?? 0} reviews)
              </Text>
            </View>
          </View>
        </View>
        <Divider />

        {/* About / HouseRules */}
        <View style={styles.section}>
          <View style={styles.tabs}>
            <Text style={styles.tabActive}>About</Text>
            <Text style={styles.tabInactive}>House Rules</Text>
          </View>
          <Text style={styles.descripcion} numberOfLines={6}>
            {hostel?.descripcion}
          </Text>
          <ButtonFull title="Read More" onPress={() => {}} />
        </View>
        <Divider />

        {/* Check In / Check Out */}
        <View style={styles.section}>
          <View style={styles.checkRow}>
            <View style={styles.checkItem}>
              <Ionicons
                name="log-in-outline"
                size={40}
                color={colors.primary[500]}
              />
              <View>
                <Text style={styles.checkLabel}>Check In</Text>
                <Text style={styles.checkTime}>15:00 - 23:00</Text>
              </View>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.checkItem}>
              <Ionicons
                name="log-out-outline"
                size={40}
                color={colors.accent[500]}
              />
              <View>
                <Text style={styles.checkLabel}>Check Out</Text>
                <Text style={styles.checkTime}>Until 11:00</Text>
              </View>
            </View>
          </View>
        </View>
        <Divider />

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            {visibleServices.map(({ servicio }) => (
              <View key={servicio.id_servicio} style={styles.serviceItem}>
                <View style={styles.serviceIcon}>
                  <Ionicons
                    name={servicio.icono}
                    size={20}
                    color={colors.primary[500]}
                  />
                </View>
                <Text style={styles.serviceName}>{servicio.nombre}</Text>
              </View>
            ))}
          </View>
          {hasMoreThanPreview && (
            <ButtonFull
              title={showAllServices ? "Show Less" : "All Services"}
              onPress={() => setShowAllServices((prev) => !prev)}
            />
          )}
        </View>

        <Divider />

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.address}>
            {hostel?.direccion?.calle} {hostel?.direccion?.numero},{" "}
            {hostel?.ciudad?.nombre}
          </Text>
          <View style={styles.distanceRow}>
            <Ionicons name="location" size={18} color={colors.primary[500]} />
            <Text style={styles.distance}>
              Centro de {hostel?.ciudad?.nombre}
            </Text>
          </View>
          <MapPlaceholder ciudad={hostel?.ciudad?.nombre} />
        </View>

        <Divider />

        {/* Calendario */}
        <View style={styles.section}>
          {/* {checkIn && checkOut && ( */}
          <>
            <Text style={styles.nightsTitle}>
              {getNights()} Nights in {hostel?.ciudad?.nombre}
            </Text>
            <Text style={styles.nightsDates}>
              {checkIn} - {checkOut}
            </Text>
          </>
          {/* )} */}
          <Calendar
            onDayPress={handleDayPress}
            markingType="period"
            markedDates={markedDates}
            theme={{
              backgroundColor: "#FFFFFF",
              calendarBackground: "#FFFFFF",
              selectedDayBackgroundColor: colors.accent[400],
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: colors.primary[500],
              arrowColor: colors.primary[500],
              borderRadius: 16,
            }}
            style={styles.calendar}
          />

          {/* Guests */}
          <View style={styles.guestsRow}>
            <Text style={styles.guestsLabel}>Guests</Text>
            <View style={styles.guestsControls}>
              <TouchableOpacity
                style={styles.guestBtn}
                onPress={() => setGuests(Math.max(1, guests - 1))}
              >
                <Ionicons name="remove" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.guestsCount}>{guests}</Text>
              <TouchableOpacity
                style={styles.guestBtn}
                onPress={() => setGuests(guests + 1)}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Divider />

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
        </View>
        <View
          style={{
            paddingVertical: 30,
            backgroundColor: colors.primary[400],
            marginBottom: 30,
          }}
        >
          {hostel?.ratings?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 20,
                paddingHorizontal: 16,
              }}
            >
              {hostel.ratings.map((r, i) => (
                <ReviewCard key={i} rating={r} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerPrice}>
              {hostel?.habitaciones?.[0]?.precio_base ?? "—"} €
            </Text>
            <Text style={styles.footerNights}>
              {getNights() > 0
                ? `${getNights()} nights: ${checkIn} - ${checkOut}`
                : "Selecciona fechas"}
            </Text>
            <Text style={styles.footerPolicy}>Non-refundable</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.light },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroWrapper: { position: "relative" },
  heroImage: { width, height: 280 },
  dots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: { backgroundColor: "#FFFFFF", width: 18 },
  heroButtons: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroRight: { flexDirection: "row", gap: 8 },
  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Section Info
  section: { padding: 16, gap: 8 },
  nombre: { fontSize: 24, fontWeight: "800", color: colors.text.primary },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ciudad: { fontSize: 16, color: colors.text.muted },
  rating: { fontSize: 16, fontWeight: "700", color: colors.text.primary },
  reviews: { fontSize: 16, color: colors.text.muted },

  // About / HouseRules
  tabs: { flexDirection: "row", gap: 20, marginBottom: 12 },
  tabActive: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary[500],
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[500],
    paddingBottom: 4,
  },
  tabInactive: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.muted,
    paddingBottom: 4,
  },
  descripcion: { fontSize: 16, color: colors.text.secondary, lineHeight: 22 },
  //   Checkin / Checkout
  checkRow: { flexDirection: "row", alignItems: "center" },
  checkItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  checkLabel: { fontSize: 14, color: colors.text.primary, fontWeight: "600" },
  checkTime: { fontSize: 12, color: colors.text.muted },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.default,
    marginHorizontal: 16,
  },

  // Services
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary[500],
    marginBottom: 16,
  },
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  serviceItem: {
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceName: { fontSize: 13, color: colors.text.primary, flex: 1 },

  // Location
  address: { fontSize: 16, color: colors.text.primary, lineHeight: 20 },
  distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  distance: { fontSize: 16, color: colors.text.muted },

  // Calendar
  nightsTitle: { fontSize: 20, fontWeight: "700", color: colors.primary[500] },
  nightsDates: { fontSize: 16, color: colors.text.muted, marginBottom: 8 },
  calendar: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
    aspectRatio: 1,
  },
  guestsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 16,
  },
  guestsLabel: { fontSize: 20, fontWeight: "700", color: colors.text.primary },
  guestsControls: { flexDirection: "row", alignItems: "center", gap: 12 },
  guestBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
  },
  guestsCount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    minWidth: 24,
    textAlign: "center",
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    marginBottom: 50,
  },
  footerPrice: { fontSize: 20, fontWeight: "800", color: colors.text.primary },
  footerNights: { fontSize: 14, color: colors.text.muted },
  footerPolicy: { fontSize: 14, color: colors.text.muted },
  bookBtn: {
    backgroundColor: colors.accent[500],
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: colors.accent[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  bookBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
