import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Vibration,
  Alert,
  Animated,
} from "react-native";

import { Audio } from "expo-av";
import LoadingOverlay from "@/components/LoadingOverlay";
import TopBar from "@/components/TopBar";
import MonitorButton from "@/components/MonitorButton";
import { fontFamily } from "@/dimensions/fontFamily";

export default function MonitoramentoScreen() {
  const [percentual, setPercentual] = useState(0);
  const [dataHora, setDataHora] = useState("");
  const [monitorando, setMonitorando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const alertaEnviadoRef = useRef(false);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentual,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentual]);

  const animatedHeight = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Overlay de carregamento */}
      <LoadingOverlay visible={carregando} message="Carregando dados..." />

      {/* Topo */}
      <TopBar />

      {/* Data/hora */}
      <Text style={styles.updateText}>Última atualização:</Text>
      <Text style={styles.updateSubText}>{dataHora}</Text>

      {/* Círculo com nível */}
      <View style={styles.circle}>
        <Animated.View style={[styles.fill, { height: animatedHeight }]} />
        <Text style={styles.percentageText}>{percentual}%</Text>
      </View>

      {/* Texto informativo */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {monitorando
            ? "Aperte o botão abaixo para\ndesligar o monitoramento"
            : "Aperte o botão abaixo para\ncomeçar o monitoramento"}
        </Text>

        <MonitorButton
          monitorando={monitorando}
          carregando={carregando}
          onPress={alternarMonitoramento}
        />
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
  updateText: {
    color: "white",
    fontSize: 20,
    fontFamily: fontFamily.medium,
  },
  updateSubText: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 20,
    fontFamily: fontFamily.regular,
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
    zIndex: 2,
    marginBottom: 80,
    fontFamily: fontFamily.bold,
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
    fontFamily: fontFamily.medium,
  },
});
