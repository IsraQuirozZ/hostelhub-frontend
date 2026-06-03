import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function CityCard({ city, image }) {
  return (
    <ImageBackground
      source={image}
      style={styles.card}
      imageStyle={styles.image}
      pointerEvents="none"
    >
      <View style={styles.overlay} />

      <View style={styles.label}>
        <Text style={styles.labelText}>{city}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-start",
  },

  image: {
    borderRadius: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  label: {
    marginTop: 35,
    marginRight: 15,

    backgroundColor: "rgb(0, 0, 0)",

    borderColor: "#FFFFFF",
    borderWidth: 2,

    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  labelText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
});
