import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { UIColors } from "../constants/Colors";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";

interface DropDownProps {
  selectedCurrency: CurrencyModel;
  onCurrencyChange: (currency: CurrencyModel) => void;
  labelText: string;
}

const DropDown: React.FC<DropDownProps> = ({
  selectedCurrency,
  onCurrencyChange,
  labelText,
}) => {
  const currencies = CurrencyController.currencies;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => onCurrencyChange(itemValue)}
          style={{ color: UIColors.primaryText, fontFamily: "Poppins" }}
        >
          {currencies.map((currency) => (
            <Picker.Item
              key={currency.code}
              label={`${currency.name} (${currency.code})`}
              value={currency}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 18,
    color: UIColors.primaryText,
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  pickerContainer: {
    width: 300,
    backgroundColor: UIColors.secondaryBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UIColors.primaryBorderColor,
  },
});

export default DropDown;
