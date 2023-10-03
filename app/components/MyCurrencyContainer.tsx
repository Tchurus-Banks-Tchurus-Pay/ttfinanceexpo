import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../constants/Colors";
import { CurrencyController } from "../constants/CurrencyController";
import { UIScale } from "../constants/UIScale";
import { UserSession } from "../constants/UserSession";
import UIText from "./UIText";

interface MyCurrencyContainerProps {
  code: string;
  amount: string;
}

const MyCurrencyContainer: React.FC<MyCurrencyContainerProps> = ({
  code,
  amount,
}) => {
  const currency = CurrencyController.getCurrencyByCode(code);
  const amountConvertedToMainCurrency = CurrencyController.convertCurrency(
    code,
    UserSession.loggedUser!.mainCurrency,
    amount
  );

  return (
    <View style={[styles.container, { width: UIScale.deviceWidth }]}>
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.circle,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          <Text style={[styles.currencyCode, { color: currency?.color }]}>
            {code}
          </Text>
        </View>
        <Text style={styles.currencyName}>{currency?.name}</Text>
      </View>
      <View style={styles.rightContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.currencySymbol}>{currency?.symbol}</Text>
          <Text style={styles.currencyAmount}>{amount}</Text>
        </View>
        <UIText style={styles.additionalText}>
          {amountConvertedToMainCurrency} {UserSession.loggedUser!.mainCurrency}
        </UIText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    backgroundColor: "#232537",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#31313b",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  currencyCode: {
    fontSize: 18,
  },
  currencyName: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  rightContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 18,
    color: "#fff",
  },
  currencyAmount: {
    marginLeft: 4,
    fontSize: 18,
    color: "#fff",
  },
  additionalText: {
    marginLeft: 4,
    fontSize: 11,
    color: "#81828c",
  },
});

export default MyCurrencyContainer;
