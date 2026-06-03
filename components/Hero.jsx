import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function HeroCity({ image, ciudad }) {
  return (
    <ImageBackground
      source={image}
      style={styles.hero}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Hostels in {ciudad}</Text>
        <Text style={styles.subtitle}>
          Book your next stay and connect{"\n"}with people around the world.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 220 },
  image: {},
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 20,
    paddingBottom: 28,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#FFFFFF", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 19 },
});
