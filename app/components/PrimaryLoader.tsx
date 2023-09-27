import React from "react";
import { StyleSheet, Text } from "react-native";



interface Props {}

const PrimaryLoader: React.FC<Props> = ({}) => {
  return  <Text>Carregando...</Text>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default PrimaryLoader;
