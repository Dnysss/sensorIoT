import { fontFamily } from "@/dimensions/fontFamily";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface Props {
  monitorando: boolean;
  carregando: boolean;
  onPress: () => void;
}

export default function MonitorButton({
  monitorando,
  carregando,
  onPress,
}: Props) {
  return (
    <Button
      icon={monitorando ? "pause" : "power"}
      mode="contained"
      onPress={onPress}
      disabled={carregando}
      style={[
        styles.button,
        {
          backgroundColor: monitorando ? "#f73636ff" : "#2196f3",
        },
      ]}
      contentStyle={{ paddingVertical: 10 }}
      labelStyle={{ fontSize: 16 }}
    >
      {carregando ? (
        <ActivityIndicator color="white" size="small" />
      ) : monitorando ? (
        "Desligar"
      ) : (
        "Monitorar"
      )}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    fontFamily: fontFamily.medium,
  },
});
