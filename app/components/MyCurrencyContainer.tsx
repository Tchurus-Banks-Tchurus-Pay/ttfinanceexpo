import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CurrencyController } from "../constants/CurrencyController";

interface MyCurrencyContainerProps {
  code: string;
  amount: string;
}

const MyCurrencyContainer: React.FC<MyCurrencyContainerProps> = ({
  code,
  amount,
}) => {
  const currency = CurrencyController.getCurrencyByCode(code);
  return (
    <View style={[styles.container, { width: "100%" }]}>
      <View style={styles.leftContainer}>
        <View style={styles.circle}>
          <Text style={styles.currencyCode}>{code}</Text>
        </View>
        <Text style={styles.currencyName}>{currency?.name}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.currencySymbol}>{currency?.symbol}</Text>
        <Text style={styles.currencyAmount}>{amount}</Text>
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyCode: {
    fontSize: 18,

    color: "#232537",
  },
  currencyName: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
  },
  rightContainer: {
    flexDirection: "row",
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
});

export default MyCurrencyContainer;
