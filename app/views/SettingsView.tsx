import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import PrimaryHeader from "../components/PrimaryHeader";
import colors from "../constants/Colors";

interface Props {
  navigation: NavigationProp<any>;
}

const SettingsView: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <PrimaryHeader hasBackButton={true} title="Configurações"  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Poppins",
    color: "#fff",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  contentContainer: {
    flex: 1,
  },
});

export default SettingsView;

