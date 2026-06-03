import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";

const CITY_MAPS = {
  Madrid: require("../assets/images/maps/map.png"),
  Barcelona: require("../assets/images/maps/map.png"),
  Londres: require("../assets/images/maps/map.png"),
  Paris: require("../assets/images/maps/map.png"),
  Roma: require("../assets/images/maps/map.png"),
};

export default function MapPlaceholder({ ciudad }) {
  return (
    <View style={styles.container}>
      <Image
        source={CITY_MAPS[ciudad] ?? require("../assets/images/maps/map.png")}
        style={styles.map}
        resizeMode="cover"
      />
      <View style={styles.pin}>
        <Ionicons name="home" size={18} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary[400],
    alignItems: "center",
    justifyContent: "center",
  },
  map: { ...StyleSheet.absoluteFillObject },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
