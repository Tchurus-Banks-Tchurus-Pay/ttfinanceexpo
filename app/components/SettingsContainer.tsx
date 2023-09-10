import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import colors from "../constants/Colors";
import { UIScale } from "../constants/UIScale";

interface Props {
  text: string;
  onTap?: Function;
}

const SettingsContainer: React.FC<Props> = ({ text, onTap }) => {
  const navigation = useNavigation();

  const handleTap = () => {
    if (onTap) {
      onTap();
    }
  };

  return (
    <TouchableOpacity onPress={handleTap}>
      <View
        style={{
          height: 60,
          width: UIScale.deviceWidth,
          backgroundColor: colors.tertiaryBackground,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.secondaryBackground,
        }}
      >
        <Text style={{ color: "white", fontFamily: "Poppins", fontSize: 16 }}>
          {text}
        </Text>
        <Ionicons name="chevron-forward-outline" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default SettingsContainer;
