import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";

export default function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: 16,
    marginHorizontal: 16,
  },
});
