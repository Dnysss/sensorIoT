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

      {/* Logo e título */}
      <View style={styles.logoBox}>
        <Text style={styles.logo}>Logo</Text>
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

      {/* Botão de sair */}
      <View style={styles.logoutBox}>
        <IconButton
          icon="power"
          size={20}
          mode="contained"
          onPress={() => console.log("Sair")}
          iconColor="#fff"
          style={styles.logoutButton}
        />
        <Text style={styles.logoutText}>Sair do app</Text>
      </View>
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
  logo: {
    fontSize: 20,
    color: "#fff",
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
  logoutBox: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: "#222",
    marginRight: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});
