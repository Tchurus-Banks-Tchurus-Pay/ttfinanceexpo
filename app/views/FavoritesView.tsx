import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PrimaryHeader from "../components/PrimaryHeader";
import PrimaryTextField from "../components/PrimaryTextField";
import UIText from "../components/UIText";
import { CallbackTrigger } from "../constants/CallbackTrigger";
import colors from "../constants/Colors";
import { tabBarHeight } from "../constants/Constants";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";
import { supabase } from "../constants/Supabase";
import { UIScale } from "../constants/UIScale";
import { UserSession } from "../constants/UserSession";

interface Props {
  navigation: NavigationProp<any>;
}

const FavoritesView: React.FC<Props> = ({ navigation }) => {
  const [favoritedCurrencies, setFavoritedCurrencies] = useState<
    CurrencyModel[]
  >([]);

  const [valueToConvert, setValueToConvert] = useState<Number>(1);

  React.useEffect(() => {
    const fetchData = async () => {
      await UserSession.updateLoggedUserInfo();
      await getFavoriteCurrenciesCodes();
    };
    fetchData();
  }, []);

  const getFavoriteCurrenciesCodes = async () => {
    let { data, error, status } = await supabase
      .from("favorites_currency")
      .select("currency_code")
      .eq("user_id", UserSession.loggedUser?.id);

    if (error) {
      throw error;
    } else {
      let favoriteCurrenciesCodes: CurrencyModel[] = [];
      data?.forEach((favoriteCurrency) => {
        favoriteCurrenciesCodes.push(
          CurrencyController.getCurrencyByCode(favoriteCurrency.currency_code)!
        );
      });
      setFavoritedCurrencies(favoriteCurrenciesCodes);
      console.log(favoriteCurrenciesCodes);
    }
  };

  const mainCurrency = CurrencyController.getCurrencyByCode(
    UserSession.loggedUser?.mainCurrency!
  );

  CallbackTrigger.addCallback("update-favorites", getFavoriteCurrenciesCodes);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <PrimaryHeader title="Favoritas" />
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <UIText>Moeda Principal:</UIText>
          <UIText>{mainCurrency!.code}</UIText>
          <UIText>{mainCurrency!.name}</UIText>
          <PrimaryTextField
            style={{ marginTop: 10 }}
            placeholder="Valor"
            keyboardType="numeric"
            onChangeText={(text) => setValueToConvert(Number(text))}
          />
        </View>

        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={{
            marginTop: 10,
            height: UIScale.deviceHeight - tabBarHeight - 70,
          }}
        >
          {favoritedCurrencies.map((item, index) => (
            <View
              style={{
                marginBottom: 1,
                padding: 10,
                backgroundColor: colors.secondaryBackground,
              }}
              key={index}
            >
              <UIText>{item.code}</UIText>
              <UIText>{item.name}</UIText>
              <UIText>
                {valueToConvert.toString()} {mainCurrency!.code} ={" "}
                {CurrencyController.convertCurrency(
                  mainCurrency!.code,
                  item.code,
                  valueToConvert.toString()
                )}{" "}
                {item!.code}
              </UIText>
              <UIText>
                {valueToConvert.toString()} {item!.code} ={" "}
                {CurrencyController.convertCurrency(
                  item.code,
                  mainCurrency!.code,
                  valueToConvert.toString()
                )}{" "}
                {mainCurrency!.code}
              </UIText>
            </View>
          ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
  },
});

export default FavoritesView;
