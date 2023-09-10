import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UIScale } from "../constants/UIScale";

interface Props {
  title: string;
  hasBackButton?: boolean;
}

const PrimaryHeader: React.FC<Props> = ({ title, hasBackButton = false }) => {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: "#2b2c3e", marginTop: UIScale.insets.top },
      ]}
    >
      <View style={styles.headerLeft}>
        {hasBackButton && (
          <TouchableOpacity onPress={handleBackButtonPress}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 25,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Poppins",
    color: "#fff",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#fff",
    marginRight: 10,
  },
});

export default PrimaryHeader;
