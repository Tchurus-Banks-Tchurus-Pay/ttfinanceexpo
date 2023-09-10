import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import DropDown from "../components/CurrencyDropdown";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryTextField from "../components/PrimaryTextField";
import { CallbackTrigger } from "../constants/CallbackTrigger";
import colors from "../constants/Colors";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";
import { PushNotificationsHandler } from "../constants/PushNotificationsHandler";
import { supabase } from "../constants/Supabase";
import { UserSession } from "../constants/UserSession";

interface Props {
  navigation: NavigationProp<any>;
}

const TransactionsView: React.FC<Props> = ({ navigation }) => {
  const [moneyToSend, setMoneyToSend] = useState<string>("");
  const [usernameToSend, setUsernameToSend] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [myCurrencies, setMyCurrencies] = useState<CurrencyModel[]>([]);
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] =
    useState<CurrencyModel>();

  React.useEffect(() => {
    getMyPortfolioCurrencies();
  }, []);

  const handleCurrencyChangeFrom = (currency: CurrencyModel) => {
    setSelectedCurrencyFrom(currency);
    setBalance(UserSession.getLoggedUser()?.getBalanceIn(currency.code)!);
    console.log(currency);
  };

  const getMyPortfolioCurrencies = async () => {
    console.log("getMyPortfolioCurrencies");
    console.log("getMyPortfolioCurrencies");
    console.log("getMyPortfolioCurrencies");

    const currencies: CurrencyModel[] = [];
    for (let i = 0; i < UserSession.getLoggedUser()?.portifolio.length!; i++) {
      if (UserSession.getLoggedUser()?.portifolio[i].amount != "0") {
        currencies.push(
          CurrencyController.getCurrencyByCode(
            UserSession.getLoggedUser()?.portifolio[i].code!
          )!
        );
      }
    }
    setMyCurrencies(currencies);
    setSelectedCurrencyFrom(currencies[0]);
    setBalance(UserSession.getLoggedUser()?.getBalanceIn(currencies[0].code)!);
    setMoneyToSend("");
    setUsernameToSend("");
  };

  CallbackTrigger.addCallback("get-portfolio", getMyPortfolioCurrencies);

  const handleMoneyChange = (text: string) => {
    setMoneyToSend(text);
  };

  const handleUsernameChange = (text: string) => {
    setUsernameToSend(text);
  };

  const sendMoney = async () => {
    const hasMoney =
      await UserSession.getLoggedUser()?.verifyIfUserHasThisAmountInThis(
        moneyToSend,
        selectedCurrencyFrom?.code!
      );

    if (hasMoney) {
      console.log("Tem dinheiro");
      console.log(UserSession.getLoggedUser()?.username);
      console.log(usernameToSend);
      console.log(selectedCurrencyFrom?.code);
      console.log(moneyToSend);

      let { data, error } = await supabase.rpc("transfer_transaction", {
        transfer_currency_code: selectedCurrencyFrom?.code,
        username_from: UserSession.getLoggedUser()?.username,
        username_to: usernameToSend,
        transfer_value: moneyToSend,
      });

      if (error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Transferência realizada com sucesso!");
        await PushNotificationsHandler.sendPushNotification(
          usernameToSend,
          "Você recebeu uma quantia de " +
            UserSession.getLoggedUser()?.username!,
          "Você acabou de receber " +
            moneyToSend +
            " " +
            selectedCurrencyFrom?.code +
            " de " +
            UserSession.getLoggedUser()?.username! +
            "!"
        );
        CallbackTrigger.triggerAll();
      }
      setMoneyToSend("");
      setUsernameToSend("");
    } else {
      Alert.alert("Usuário não possui essa quantia nessa moeda! Pobre!");
      setMoneyToSend("");
      setUsernameToSend("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: "#2b2c3e" }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Movimentações</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.topContainer,
            { backgroundColor: "#2b2c3e", flex: 0.6 },
          ]}
        >
          <Text style={styles.convertedValueText}>Enviar para:</Text>
          <PrimaryTextField
            placeholder="Digite o usuário:"
            onChangeText={handleUsernameChange}
            style={styles.inputField}
            value={usernameToSend}
          />
          {selectedCurrencyFrom !== undefined ? (
            <DropDown
              selectedCurrency={selectedCurrencyFrom}
              onCurrencyChange={handleCurrencyChangeFrom}
              labelText="Selecione a moeda:"
              currencies={myCurrencies}
            />
          ) : (
            <Text style={styles.loadingText}>Carregando...</Text>
          )}
          {selectedCurrencyFrom !== undefined ? (
            <Text style={styles.balanceText}>
              Saldo: {balance} {selectedCurrencyFrom.name}
            </Text>
          ) : (
            <Text style={styles.loadingText}>Carregando...</Text>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>
              {selectedCurrencyFrom != undefined
                ? selectedCurrencyFrom!.symbol
                : ""}
            </Text>
            <PrimaryTextField
              placeholder="Valor a Enviar"
              onChangeText={handleMoneyChange}
              keyboardType="numeric"
              style={styles.inputField}
              value={moneyToSend}
            />
          </View>
          <View style={{ width: 350 }}>
            <PrimaryButton
              title="Enviar"
              onPress={() => {
                sendMoney();
              }}
            />
          </View>
        </View>
      </View>
    </View>
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
    marginTop: 25,
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
    flex: 0.6, // Alterado para 60% da tela
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
  balanceText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#fff",
  },
  convertedText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#fff",
  },
  loadingText: {
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

export default TransactionsView;
