import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { Image } from "react-native";
import { useFonts } from "expo-font";
import { fontFamily } from "@/dimensions/fontFamily";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";

export default function RootLayout() {
  const [loaded] = useFonts({
    [fontFamily.bold]: require("../assets/fonts/Poppins-Bold.ttf"),
    [fontFamily.regular]: require("../assets/fonts/Poppins-Regular.ttf"),
    [fontFamily.medium]: require("../assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        drawerStyle: { backgroundColor: "#333" },
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerRight: () => (
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 30, height: 30, marginRight: 15 }}
            resizeMode="contain"
          />
        ),
        headerTintColor: "#fff",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}
