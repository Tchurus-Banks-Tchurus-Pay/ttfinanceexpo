import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CurrencyController } from "../constants/CurrencyController";
import { UIScale } from "../constants/UIScale";
import { UserSession } from "../constants/UserSession";

export interface TransactionContainerProps {
  currencyCode: string;
  personInteractionName: string;
  wasSended: boolean;
  amount: string;
}

const TransactionContainer: React.FC<TransactionContainerProps> = ({
  currencyCode,
  personInteractionName,
  wasSended,
  amount,
}) => {
  const currency = CurrencyController.getCurrencyByCode(currencyCode);
  const favoriteCurrency = CurrencyController.getCurrencyByCode(
    UserSession.loggedUser!.mainCurrency!
  );
  return (
    <View style={[styles.container, { width: UIScale.deviceWidth }]}>
      <View style={[styles.leftContainer]}>
        <View style={styles.circle}>
          {wasSended ? (
            <MaterialCommunityIcons
              name="arrow-right"
              color={"red"}
              size={28}
            />
          ) : (
            <MaterialCommunityIcons
              name="arrow-left"
              color={"green"}
              size={28}
            />
          )}
        </View>
      </View>
      <View style={styles.centerContainer}>
        <Text style={styles.currencyName}>{currency?.name}</Text>
        {wasSended ? (
          <Text style={[styles.nameAndFavoriteText]}>
            Enviado para: {personInteractionName}
          </Text>
        ) : (
          <Text style={[styles.nameAndFavoriteText]}>
            Recebido de: {personInteractionName}
          </Text>
        )}
      </View>
      <View style={styles.rightContainer}>
        {wasSended ? (
          <Text style={[styles.amountText, { color: "red" }]}>
            {currency?.symbol} {amount}
          </Text>
        ) : (
          <Text style={[styles.amountText, { color: "green" }]}>
            {" "}
            {currency?.symbol} {amount}
          </Text>
        )}
        <Text style={styles.nameAndFavoriteText}>
          {favoriteCurrency?.symbol}{" "}
          {CurrencyController.convertCurrency(
            currencyCode,
            favoriteCurrency?.code!,
            amount
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    backgroundColor: "#232537",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#31313b",
  },
  leftContainer: {
    flex: 1,
    alignItems: "stretch",
    // backgroundColor: "red",
  },
  centerContainer: {
    flex: 3,
    alignItems: "stretch",
    flexDirection: "column",
  },
  rightContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: "#2e3041",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyName: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#fff",
  },
  nameAndFavoriteText: {
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#81828c",
  },
  amountText: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
});

export default TransactionContainer;
