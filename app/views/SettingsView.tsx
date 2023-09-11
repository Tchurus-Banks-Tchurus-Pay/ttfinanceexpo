import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import PrimaryHeader from "../components/PrimaryHeader";
import SettingsContainer from "../components/SettingsContainer";
import colors from "../constants/Colors";
import { supabase } from "../constants/Supabase";

interface Props {
  navigation: NavigationProp<any>;
}

const SettingsView: React.FC<Props> = ({ navigation }) => {
  const printSomething = () => {
    console.log("Hello World");
  };

  const goToAccount = () => {
    navigation.navigate("account");
  };

  const goToCurrenciesToLike = () => {
    navigation.navigate("currencies-to-like");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader hasBackButton={true} title="Configurações" />
      <SettingsContainer
        text="Privacidade e Segurança"
        onTap={printSomething}
      />
      <SettingsContainer text="Conta" onTap={goToAccount} />
      <SettingsContainer text="Moedas Favoritas" onTap={goToCurrenciesToLike} />
      <SettingsContainer text="Ajuda e Suporte" onTap={printSomething} />
      <SettingsContainer text="Sair" onTap={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
});

export default SettingsView;
