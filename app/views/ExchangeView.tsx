import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DropDown from "../components/CurrencyDropdown";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryHeader from "../components/PrimaryHeader";
import PrimaryTextField from "../components/PrimaryTextField";
import colors from "../constants/Colors";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";

interface Props {
  navigation: NavigationProp<any>;
}

const ExchangeView: React.FC<Props> = ({ navigation }) => {
  const [amountToConvert, setAmountToConvert] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] =
    useState<CurrencyModel>(CurrencyController.currencies[0]);
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState<CurrencyModel>(
    CurrencyController.currencies[1]
  );

  const handleCurrencyChangeFrom = (currency: CurrencyModel) => {
    setSelectedCurrencyFrom(currency);
    console.log(currency);
  };

  const handleCurrencyChangeTo = (currency: CurrencyModel) => {
    setSelectedCurrencyTo(currency);
    console.log(currency);
  };

  const handleTextChange = (text: string) => {
    setAmountToConvert(text);
  };

  const convert = () => {
    console.log("Convertendo...");

    const valueToConvert = amountToConvert;
    const newValue = CurrencyController.convertCurrency(
      selectedCurrencyFrom.code,
      selectedCurrencyTo.code,
      valueToConvert
    );
    console.log(newValue);
    setConvertedValue(newValue);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <PrimaryHeader title="Câmbio" />
        <View style={styles.contentContainer}>
          <View style={[styles.topContainer, { backgroundColor: "#2b2c3e" }]}>
            <DropDown
              selectedCurrency={selectedCurrencyFrom}
              onCurrencyChange={handleCurrencyChangeFrom}
              labelText="Converter de:"
            />
            <DropDown
              selectedCurrency={selectedCurrencyTo}
              onCurrencyChange={handleCurrencyChangeTo}
              labelText="para:"
            />
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>
                {selectedCurrencyFrom.symbol}
              </Text>
              <PrimaryTextField
                placeholder="Valor a ser convertido"
                onChangeText={handleTextChange}
                keyboardType="numeric"
                style={styles.inputField}
              />
            </View>
            <View style={{ width: 350 }}>
              <PrimaryButton title="Converter" onPress={() => convert()} />
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.convertedText}>Valor Convertido:</Text>
            <Text style={styles.convertedValueText}>
              {selectedCurrencyTo.symbol + " "}
              {convertedValue}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 36,
    fontFamily: "Poppins",
    color: "#fff",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  contentContainer: {
    flex: 1,
  },
  topContainer: {
    flex: 3,
    justifyContent: "space-around",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
  },
  convertedValueText: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "#fff",
  },
  convertedText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: 71,
    paddingStart: 60,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "#fff",
    paddingHorizontal: 10,
  },
  inputField: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    marginBottom: 10,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#282a36",
    borderWidth: 1,
    borderColor: "#44475c",
    fontFamily: "Poppins",
  },
});

export default ExchangeView;
