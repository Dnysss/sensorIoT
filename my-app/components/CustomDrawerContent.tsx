import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { router } from "expo-router";

export default function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Fechar */}
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => props.navigation.closeDrawer()}
          iconColor="#fff"
        />
      </View>

      {/* título */}
      <View style={styles.logoBox}>
        <Text style={styles.menuTitle}>Menu</Text>
      </View>

      {/* Itens */}
      <DrawerItem
        label="Minhas Medições"
        labelStyle={styles.itemLabel}
        onPress={() => router.push("/medicoes")}
      />
      <DrawerItem
        label="Análises"
        labelStyle={styles.itemLabel}
        onPress={() => router.push("/analises")}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333",
    flex: 1,
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  logoBox: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    color: "#fff",
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#2196f3",
    width: 80,
  },
  itemLabel: {
    color: "#fff",
    marginLeft: -16,
  },
});
