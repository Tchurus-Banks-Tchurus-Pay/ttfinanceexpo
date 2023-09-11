import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FavoriteOrUnfovariteContainer from "../components/FavoriteOrUnfavoriteContainer";
import PrimaryHeader from "../components/PrimaryHeader";
import PrimaryLoader from "../components/PrimaryLoader";
import colors from "../constants/Colors";
import { tabBarHeight } from "../constants/Constants";
import { CurrencyController } from "../constants/CurrencyController";
import { supabase } from "../constants/Supabase";
import { UIScale } from "../constants/UIScale";
import { UserSession } from "../constants/UserSession";

interface Props {
  navigation: NavigationProp<any>;
}

const CurrenciesToLike: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);

  const [favoritedCurrencies, setFavoritedCurrencies] = useState<string[]>([]);

  const allCurrencies = CurrencyController.currencies;

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getFavoriteCurrenciesCodes();
      setLoading(false);
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
      let favoriteCurrenciesCodes: string[] = [];
      data?.forEach((favoriteCurrency) => {
        favoriteCurrenciesCodes.push(
          favoriteCurrency.currency_code.toUpperCase()
        );
      });
      setFavoritedCurrencies(favoriteCurrenciesCodes);
      console.log(favoriteCurrenciesCodes);
    }
  };

  const tapToFavoriteOrUnfavorite = async (currencyCode: string) => {
    const isFavorited = await verifyIfIsFavorited(currencyCode);
    if (isFavorited) {
      await unfavoriteCurrency(currencyCode);
    } else {
      await favoriteCurrency(currencyCode);
    }
    await getFavoriteCurrenciesCodes();
  };

  const verifyIfIsFavorited = async (
    currencyCode: string
  ): Promise<boolean> => {
    let { data, error, status } = await supabase
      .from("favorites_currency")
      .select("*")
      .eq("user_id", UserSession.loggedUser?.id)
      .eq("currency_code", currencyCode);

    if (error) {
      throw error;
    } else {
      if (data?.length == 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  const favoriteCurrency = async (currencyCode: string) => {
    let { data, error, status } = await supabase
      .from("favorites_currency")
      .insert({
        user_id: UserSession.loggedUser?.id,
        currency_code: currencyCode,
      });

    if (error) {
      throw error;
    } else {
    }
  };

  const unfavoriteCurrency = async (currencyCode: string) => {
    let { data, error, status } = await supabase
      .from("favorites_currency")
      .delete()
      .eq("user_id", UserSession.loggedUser?.id)
      .eq("currency_code", currencyCode);

    if (error) {
      throw error;
    } else {
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader hasBackButton={true} title="Moedas" />

      {loading == true ? (
        <View
          style={{
            height: UIScale.deviceHeight - tabBarHeight,
            width: UIScale.deviceWidth,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PrimaryLoader />
        </View>
      ) : (
        <ScrollView
          scrollEnabled={true}
          style={{ height: UIScale.deviceHeight - tabBarHeight }}
          contentContainerStyle={{
            marginTop: 10,
          }}
        >
          {allCurrencies.map((item, index) => (
            <TouchableOpacity
              onPress={() => tapToFavoriteOrUnfavorite(item.code)}
              key={index}
            >
              <FavoriteOrUnfovariteContainer
                currency={item}
                isFavorited={favoritedCurrencies.includes(item.code)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
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

export default CurrenciesToLike;
