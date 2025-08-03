import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import MonitoramentoScreen from "@/app/index";
import axios from "axios";
import { Alert, Vibration } from "react-native";

// Silenciar warnings de act() relacionados ao Icon ou Animated
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("act(...)") || args[0].includes("setState"))
    ) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Mocks
jest.mock("axios");
jest.mock("expo-av", () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            playAsync: jest.fn(),
            stopAsync: jest.fn(),
            unloadAsync: jest.fn(),
          },
        })
      ),
    },
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.spyOn(Vibration, "vibrate").mockImplementation(() => {});

describe("MonitoramentoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente os elementos principais", () => {
    const { getByText } = render(<MonitoramentoScreen />);
    expect(getByText("Última atualização:")).toBeTruthy();
    expect(getByText("0%")).toBeTruthy();
    expect(getByText(/começar o monitoramento/i)).toBeTruthy();
  });

  it("inicia o monitoramento e busca dados do backend", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        nivel: 45,
        createdAt: new Date().toISOString(),
      },
    });

    const { getByRole, getByText } = render(<MonitoramentoScreen />);
    const button = getByRole("button");

    await act(async () => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(getByText("45%")).toBeTruthy();
    });

    expect(axios.get).toHaveBeenCalledWith("https://sensoriot.pagekite.me/api/dados");
  });

  it("aciona alerta e vibração se nível >= 80", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        nivel: 85,
        createdAt: new Date().toISOString(),
      },
    });

    const { getByRole } = render(<MonitoramentoScreen />);
    const button = getByRole("button");

    await act(async () => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Atenção",
        expect.stringContaining("80%"),
        expect.any(Array)
      );

      expect(Vibration.vibrate).toHaveBeenCalledWith(1000);
    });
  });
});
