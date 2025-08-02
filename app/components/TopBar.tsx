import { fontFamily } from "@/dimensions/fontFamily";
import { View, Text, StyleSheet } from "react-native";

export default function TopBar() {
  return (
    <View style={styles.topBar}>
      <Text style={styles.logoText}>Monitoramento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 20,
    color: "#4fc3f7",
    fontFamily: fontFamily.bold
  },
});
