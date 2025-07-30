import { ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";

type Props = {
  monitorando: boolean;
  carregando: boolean;
  onPress: () => void;
};

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
      style={{
        borderRadius: 20,
        width: 180,
        backgroundColor: monitorando ? "#f83434ff" : "#2196f3",
      }}
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
