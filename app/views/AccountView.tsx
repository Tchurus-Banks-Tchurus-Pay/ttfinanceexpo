import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import DropDown from "../components/CurrencyDropdown";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryHeader from "../components/PrimaryHeader";
import PrimaryTextField from "../components/PrimaryTextField";
import UIText from "../components/UIText";
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
  const [user, setUserModel] = useState<UserModel>(UserSession.loggedUser!);
  const [usernameText, setUsernameText] = useState<string>(
    UserSession.loggedUser!.username
  );
  const [username, setUsername] = useState<string>(
    UserSession.loggedUser!.username
  );
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

  const updateUsername = async () => {
    let { error, status } = await supabase
      .from("profiles")
      .update({ username: usernameText })
      .eq("id", user.id);

    if (error && status !== 406) {
      Alert.alert("Erro", error.message);
    } else {
      await CallbackTrigger.triggerCallback("update-home-view");
      await UserSession.updateLoggedUserInfo();
      setUsername(UserSession.loggedUser!.username);
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
      <View
        style={{
          alignItems: "center",
          alignContent: "center",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <DropDown
          selectedCurrency={mainCurrency}
          onCurrencyChange={handleCurrencyChangeTo}
          labelText="Altere aqui sua moeda principal:"
        />
        <PrimaryButton title="Salvar" onPress={updateMainCurrency} />
      </View>

      {username != "" ? (
        <View>
          <UIText
            style={{
              alignItems: "center",
              alignContent: "center",
              textAlign: "center",
              marginTop: 20,
              fontSize: 18,
            }}
          >
            Seu username é: {username}
          </UIText>
          <UIText
            style={{
              alignItems: "center",
              alignContent: "center",
              textAlign: "center",
              marginTop: 4,
              fontSize: 14,
              color: "gray",
            }}
          >
            Você não pode mudá-lo.
          </UIText>
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            alignContent: "center",
            marginTop: 20,
            marginHorizontal: 20,
          }}
        >
          <PrimaryTextField
            placeholder="Username"
            onChangeText={setUsernameText}
            value={usernameText}
          />
          <PrimaryButton title="Salvar" onPress={updateUsername} />
        </View>
      )}
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
