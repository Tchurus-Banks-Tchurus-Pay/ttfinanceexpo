import React from "react";
import { StyleSheet } from "react-native";
import { Flow } from "react-native-animated-spinkit";

interface Props {}

const PrimaryLoader: React.FC<Props> = ({}) => {
  return <Flow size={48} color="#FFF" />;
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
