import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Vibration,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";

import { Audio } from "expo-av";
import LoadingOverlay from "@/components/LoadingOverlay";
import LottieView from "lottie-react-native";

export default function MonitoramentoScreen() {
  const [percentual, setPercentual] = useState(0);
  const [dataHora, setDataHora] = useState("");
  const [monitorando, setMonitorando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const alertaEnviadoRef = useRef(false);
  const intervaloRef = useRef<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const lottieRef = useRef<LottieView>(null);
  const lastFrameRef = useRef(0);

  // Atualiza dados do backend
  const carregarDados = async () => {
    try {
      const response = await axios.get(
        "https://sensoriot.pagekite.me/api/dados"
      );
      const dado = response.data;
      const nivel = Number(dado.nivel);

      setPercentual(nivel);
      setDataHora(new Date(dado.createdAt).toLocaleString("pt-BR"));

      const totalFrames = 107;
      const currentFrame = lastFrameRef.current;
      const targetFrame = (nivel / 100) * totalFrames;

      // Se o nível mudou, anima do ponto anterior ao novo
      if (Math.abs(targetFrame - currentFrame) > 1) {
        lottieRef.current?.play(currentFrame, targetFrame);
        lastFrameRef.current = targetFrame;
      }

      if (nivel >= 80 && !alertaEnviadoRef.current) {
        alertaEnviadoRef.current = true;
        Vibration.vibrate(1000);

        try {
          const { sound } = await Audio.Sound.createAsync(
            require("../assets/sound/new-notification-022-370046.mp3"),
            { shouldPlay: true, isLooping: true }
          );

          soundRef.current = sound;

          Alert.alert("Atenção", "A caixa está quase cheia (80% ou mais)!", [
            {
              text: "OK",
              onPress: async () => {
                if (soundRef.current) {
                  await soundRef.current.stopAsync();
                  await soundRef.current.unloadAsync();
                  soundRef.current = null;
                }
              },
            },
          ]);
        } catch (e) {
          console.log("Erro ao tocar som:", e);
        }
      }

      if (nivel < 80) {
        alertaEnviadoRef.current = false;
      }
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setCarregando(false);
    }
  };

  const alternarMonitoramento = () => {
    if (!monitorando) {
      setCarregando(true); // mostra o loading antes da primeira chamada
      carregarDados();
      intervaloRef.current = setInterval(carregarDados, 5000);
    } else {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      setPercentual(0);
      setDataHora("");
      lastFrameRef.current = 0;
    }
    setMonitorando(!monitorando);
  };

  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Overlay de carregamento */}
      <LoadingOverlay visible={carregando} message="Carregando dados..." />

      {/* Topo */}
      <View style={styles.topBar}>
        <Text style={styles.logoText}>Monitoramento</Text>
      </View>

      {/* Data/hora */}
      <Text style={styles.updateText}>Última atualização:</Text>
      <Text style={styles.updateSubText}>{dataHora}</Text>

      {/* Círculo com nível */}
      <View style={styles.circle}>
        <LottieView
          ref={lottieRef}
          source={require("../assets/lottie/Water filling up.json")}
          autoPlay={false}
          loop={false}
          style={{
            width: 250,
            height: 250,
            position: "absolute",
            top: -30,
          }}
        />
        <Text style={styles.percentageText}>{percentual}%</Text>
      </View>

      {/* Texto informativo */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {monitorando
            ? "Aperte o botão abaixo para\ndesligar o monitoramento"
            : "Aperte o botão abaixo para\ncomeçar o monitoramento"}
        </Text>

        <Button
          icon={monitorando ? "pause" : "power"}
          mode="contained"
          onPress={alternarMonitoramento}
          disabled={carregando}
          style={[
            styles.button,
            {
              backgroundColor: monitorando ? "#4caf50" : "#2196f3",
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 20,
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  menuIcon: {
    width: 24,
    height: 18,
    justifyContent: "space-between",
  },
  logoText: {
    fontSize: 20,
    color: "#4fc3f7",
    fontWeight: "bold",
  },
  updateText: {
    color: "white",
    fontSize: 20,
  },
  updateSubText: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 20,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#4fc3f7",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
  },
  fill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#4fc3f7",
    zIndex: 1,
  },
  percentageText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    zIndex: 2,
    marginBottom: 80,
  },
  infoBox: {
    marginBottom: 20,
    paddingHorizontal: 10,
    marginTop: 70,
  },
  infoText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 40,
  },
  button: {
    borderRadius: 20,
    width: 180,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // fundo escuro
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
