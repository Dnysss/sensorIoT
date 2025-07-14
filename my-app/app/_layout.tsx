import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { Image } from "react-native";

export default function RootLayout() {
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
