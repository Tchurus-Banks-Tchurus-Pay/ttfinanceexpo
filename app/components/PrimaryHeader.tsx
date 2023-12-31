import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UIScale } from "../constants/UIScale";

interface Props {
  title: string;
  hasBackButton?: boolean;
  iconName?: string;
  callback?: () => void;
}

const PrimaryHeader: React.FC<Props> = ({
  title,
  hasBackButton = false,
  iconName,
  callback,
}) => {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  if (iconName) {
    return (
      <View
        style={[
          styles.header,
          {
            backgroundColor: "#2b2c3e",
            marginTop: UIScale.insets.top + UIScale.statusBarHeight,
          },
        ]}
      >
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity onPress={callback}>
          <Ionicons name="settings" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: "#2b2c3e",
          marginTop: UIScale.insets.top + UIScale.statusBarHeight,
        },
      ]}
    >
      {hasBackButton ? (
        <TouchableOpacity onPress={handleBackButtonPress}>
          <MaterialCommunityIcons name="arrow-left" color={"#fff"} size={28} />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerLeftEmpty}></View>
      )}

      <Text
        style={hasBackButton ? styles.headerTextWithBack : styles.headerText}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: 25,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Poppins",
    color: "#fff",
    flex: 1,
    textAlign: "left",
  },
  headerTextWithBack: {
    fontSize: 36,
    fontFamily: "Poppins",
    color: "#fff",
    flex: 1,
    textAlign: "right",
  },
  headerLeftEmpty: {},
  backButtonText: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#fff",
    marginRight: 10,
  },
});

export default PrimaryHeader;
