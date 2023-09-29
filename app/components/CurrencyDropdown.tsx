import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import { UIColors } from "../constants/Colors";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";

interface DropDownProps {
  selectedCurrency: CurrencyModel | undefined;
  onCurrencyChange: (currency: CurrencyModel) => void;
  labelText: string;
  currencies?: CurrencyModel[]; // Tornar currencies opcional
}

const DropDown: React.FC<DropDownProps> = ({
  selectedCurrency,
  onCurrencyChange,
  labelText,
  currencies = CurrencyController.currencies, // Valor padrão
}) => {
  const data = currencies.map((currency) => `${currency.name} (${currency.code})`);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelText}</Text>
      <View style={styles.pickerContainer}>
        <ModalDropdown
          options={data}
          onSelect={(index) => onCurrencyChange(currencies[Number(index)])}
          defaultValue={`${selectedCurrency?.name} (${selectedCurrency?.code})`}
          textStyle={{ color: UIColors.primaryText, fontFamily: "Poppins" }}
          dropdownStyle={{ backgroundColor: UIColors.secondaryBackground, width: 300, borderWidth: 0, borderRadius: 10, height: 200, marginStart: -11 }}
          renderRow={(rowData, rowID, highlighted) => (
            <View
              style={{
                backgroundColor: highlighted ? UIColors.primaryBackground : UIColors.secondaryBackground,
                padding: 10,
                height: 50,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: UIColors.primaryText, fontFamily: "Poppins" }}>
                {rowData}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
    height: 60,
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
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

export default DropDown;
