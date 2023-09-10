import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import PrimaryHeader from "../components/PrimaryHeader";
import SettingsContainer from "../components/SettingsContainer";
import colors from "../constants/Colors";

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

  return (
    <View style={styles.container}>
      <PrimaryHeader hasBackButton={true} title="Configurações" />
      <SettingsContainer
        text="Privacidade e Segurança"
        onTap={printSomething}
      />
      <SettingsContainer text="Conta" onTap={goToAccount} />
      <SettingsContainer text="Moedas Favoritas" onTap={printSomething} />
      <SettingsContainer text="Ajuda e Suporte" onTap={printSomething} />
      <SettingsContainer text="Sair" onTap={printSomething} />
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
