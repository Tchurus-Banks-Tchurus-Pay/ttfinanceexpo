import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDown from "../components/CurrencyDropdown";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryHeader from "../components/PrimaryHeader";
import PrimaryTextField from "../components/PrimaryTextField";
import { CallbackTrigger } from "../constants/CallbackTrigger";
import colors from "../constants/Colors";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";
import { supabase } from "../constants/Supabase";
import { UserSession } from "../constants/UserSession";
import { UserModel } from "../model/UserModel";

interface Props {
  navigation: NavigationProp<any>;
}

const AddMoneyView: React.FC<Props> = ({ navigation }) => {
  const [user, setUserModel] = useState<UserModel>(UserSession.loggedUser!);
  const [moneyToAdd, setMoneyToAdd] = useState<string>("");
  const [isButtonToAddLoading, setIsButtonToAddLoading] =
    useState<boolean>(false);

  const [currency, setCurrency] = useState<CurrencyModel>(
    CurrencyController.getCurrencyByCode(user.mainCurrency)!
  );

  const handleCurrency = (currency: CurrencyModel) => {
    setCurrency(currency);
  };

  const addMoney = async () => {
    setIsButtonToAddLoading(true);
    const userId = UserSession.loggedUser?.id;
    let { data, error } = await supabase.rpc("addorupdateuserportfolio", {
      valuetoadd: moneyToAdd,
      currencycode: currency.code,
      userid: userId,
    });

    if (error != null) {
      setIsButtonToAddLoading(false);
      throw error;
    } else {
      setIsButtonToAddLoading(false);
      CallbackTrigger.triggerCallback("update-home-view");
    }
  };

  const handleMoneyChange = (text: string) => {
    setMoneyToAdd(text);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await UserSession.updateLoggedUserInfo();
      setUserModel(UserSession.loggedUser!);
      setCurrency(CurrencyController.getCurrencyByCode(user.mainCurrency)!);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <PrimaryHeader hasBackButton={true} title="Adicionar Câmbio" />
      <View
        style={{
          alignItems: "center",
          alignContent: "center",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <DropDown
          selectedCurrency={currency}
          onCurrencyChange={handleCurrency}
          labelText="Selecione aqui a moeda que você deseja adicionar:"
        />
        <PrimaryTextField
          placeholder="Valor a Adicionar"
          onChangeText={handleMoneyChange}
          keyboardType="numeric"
          style={styles.inputField}
          value={moneyToAdd}
          containerStyle={{ marginTop: 32 }}
        />
        <PrimaryButton
          title="Adicionar"
          onPress={addMoney}
          containerStyle={{ marginTop: 32 }}
          disabled={moneyToAdd == "" || isButtonToAddLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
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

export default AddMoneyView;
