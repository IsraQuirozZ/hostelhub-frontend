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
  const [markedDates, setMarkedDates] = useState(() => {
    if (!checkInParam || !checkOutParam) return {};
    const range = {};
    let current = new Date(checkInParam);
    const end = new Date(checkOutParam);
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      range[dateStr] = {
        color:
          dateStr === checkInParam || dateStr === checkOutParam
            ? colors.accent[500]
            : colors.accent[300],
        textColor: "#fff",
        startingDay: dateStr === checkInParam,
        endingDay: dateStr === checkOutParam,
      };
      current.setDate(current.getDate() + 1);
    }
    return range;
  });
  // Habitaciones
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [numRooms, setNumRooms] = useState(1);

  const calcRooms = () => {
    if (!selectedRoom) return 1;
    return Math.ceil(guests / selectedRoom.capacidad);
  };

  const calcTotal = () => {
    if (!selectedRoom || getNights() === 0) return 0;
    return Number(selectedRoom.precio_base) * getNights() * calcRooms();
  };

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

  const formatShortDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatLongDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}. ${year}`;
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

        {/* Habitaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rooms</Text>
          {hostel?.habitaciones?.map((hab) => (
            <TouchableOpacity
              key={hab.id_habitacion}
              style={[
                styles.roomCard,
                !hab.disponibilidad && styles.roomCardDisabled,
                selectedRoom?.id_habitacion === hab.id_habitacion &&
                  styles.roomCardSelected,
              ]}
              onPress={() => hab.disponibilidad && setSelectedRoom(hab)}
              disabled={!hab.disponibilidad}
            >
              <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTipo}>{hab.tipo}</Text>
                  {!hab.disponibilidad && (
                    <View style={styles.badgeOff}>
                      <Text style={styles.badgeOffText}>No disponible</Text>
                    </View>
                  )}
                  {selectedRoom?.id_habitacion === hab.id_habitacion && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary[500]}
                    />
                  )}
                </View>
                <View style={styles.roomMeta}>
                  <Ionicons
                    name="people-outline"
                    size={13}
                    color={colors.text.muted}
                  />
                  <Text style={styles.roomMetaText}>
                    Hasta {hab.capacidad} personas
                  </Text>
                </View>
                {hab.descripcion && (
                  <Text style={styles.roomDesc}>{hab.descripcion}</Text>
                )}
              </View>
              <View style={styles.roomPrice}>
                <Text style={styles.roomPriceAmount}>{hab.precio_base}€</Text>
                <Text style={styles.roomPriceLabel}>/ noche</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Divider />

        {/* Calendario */}
        <View style={styles.section}>
          <>
            <Text style={styles.nightsTitle}>
              {getNights()} Nights in {hostel?.ciudad?.nombre}
            </Text>
            <Text style={styles.nightsDates}>
              {formatLongDate(checkIn)} - {formatLongDate(checkOut)}
            </Text>
          </>
          <Calendar
            onDayPress={handleDayPress}
            markingType="period"
            markedDates={markedDates}
            minDate={new Date().toISOString().split("T")[0]}
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
          {selectedRoom && calcRooms() > 1 && (
            <View style={styles.roomsAlert}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.primary[500]}
              />
              <Text style={styles.roomsAlertText}>
                Necesitas {calcRooms()} habitaciones para {guests} huéspedes
              </Text>
            </View>
          )}
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
              {calcTotal() > 0 ? `${calcTotal().toFixed(0)} €` : "— €"}
            </Text>
            <Text style={styles.footerNights}>
              {selectedRoom && getNights() > 0
                ? `${getNights()} noches · ${calcRooms()} hab · ${guests} huéspedes`
                : "Selecciona fechas y habitación"}
            </Text>
            <Text style={styles.footerPolicy}>Non-refundable</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.bookBtn,
              (!selectedRoom || getNights() === 0) && styles.bookBtnDisabled,
            ]}
            disabled={!selectedRoom || getNights() === 0}
            onPress={() =>
              router.push({
                pathname: "/booking/confirm",
                params: {
                  hostalNombre: hostel.nombre,
                  hostalCiudad: hostel.ciudad?.nombre,
                  habitacionTipo: selectedRoom.tipo,
                  habitacionPrecio: selectedRoom.precio_base,
                  checkIn,
                  checkOut,
                  guests: String(guests),
                  numRooms: String(calcRooms()),
                  total: String(calcTotal().toFixed(0)),
                  id_habitacion: String(selectedRoom.id_habitacion),
                  id_hostal: String(id),
                },
              })
            }
          >
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

  roomsAlert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary[100],
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  roomsAlertText: { fontSize: 13, color: colors.primary[600], flex: 1 },

  // Habitaciones
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border.default,
  },
  roomCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[100],
  },
  roomCardDisabled: { opacity: 0.5 },
  roomInfo: { flex: 1, gap: 6 },
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roomTipo: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
  roomMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  roomMetaText: { fontSize: 12, color: colors.text.muted },
  roomDesc: { fontSize: 12, color: colors.text.secondary },
  roomPrice: { alignItems: "flex-end" },
  roomPriceAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary[600],
  },
  roomPriceLabel: { fontSize: 11, color: colors.text.muted },
  badgeOff: {
    backgroundColor: "#FEE8E8",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeOffText: { fontSize: 11, color: colors.error, fontWeight: "600" },

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
  bookBtnDisabled: { backgroundColor: colors.text.muted },
});
