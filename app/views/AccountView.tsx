import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDown from "../components/CurrencyDropdown";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryHeader from "../components/PrimaryHeader";
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

const AccountView: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUserModel] = useState<UserModel>(UserSession.loggedUser!);
  const [mainCurrency, setMainCurrency] = useState<CurrencyModel>(
    CurrencyController.getCurrencyByCode(user.mainCurrency)!
  );

  const handleCurrencyChangeTo = (currency: CurrencyModel) => {
    setMainCurrency(currency);
  };

  const updateMainCurrency = async () => {
    let { error, status } = await supabase
      .from("profiles")
      .update({ main_currency_code: mainCurrency.code })
      .eq("id", user.id);

    if (error && status !== 406) {
      throw error;
    } else {
      CallbackTrigger.triggerCallback("update-home-view");
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await UserSession.updateLoggedUserInfo();
      setUserModel(UserSession.loggedUser!);
      setMainCurrency(CurrencyController.getCurrencyByCode(user.mainCurrency)!);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <PrimaryHeader hasBackButton={true} title="Conta" />
      <DropDown
        selectedCurrency={mainCurrency}
        onCurrencyChange={handleCurrencyChangeTo}
        labelText="Altere aqui sua moeda principal:"
      />
      <PrimaryButton title="Salvar" onPress={updateMainCurrency} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
});

export default AccountView;
