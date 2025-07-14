import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import MedicoesScreen from "../analises";
import AnalisesScreen from "../analises";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 260 },
      }}
    >
      <Drawer.Screen name="Medicoes" component={MedicoesScreen} />
      <Drawer.Screen name="Analises" component={AnalisesScreen} />
    </Drawer.Navigator>
  );
}
