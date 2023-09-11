import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import colors from "../constants/Colors";
import { CurrencyModel } from "../constants/CurrencyController";
import { UIScale } from "../constants/UIScale";
import UIText from "./UIText";

interface FavoriteOrUnfovariteContainer {
  currency: CurrencyModel;
  isFavorited: boolean;
}

const FavoriteOrUnfovariteContainer: React.FC<
  FavoriteOrUnfovariteContainer
> = ({ currency, isFavorited }) => {
  return (
    <View
      style={{
        height: 70,
        width: UIScale.deviceWidth,
        backgroundColor: colors.secondaryBackground,
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomColor: colors.tertiaryBackground,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View>
        <UIText>{currency.code}</UIText>
        <UIText>{currency.name}</UIText>
      </View>
      {isFavorited ? (
        <MaterialCommunityIcons name="heart" color={"white"} size={25} />
      ) : (
        <MaterialCommunityIcons
          name="heart-outline"
          color={"white"}
          size={25}
        />
      )}
    </View>
  );
};

export default FavoriteOrUnfovariteContainer;
