import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import DropDown from "../components/CurrencyDropdown";
import NoUserNameBox from "../components/NoUsernameBox";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryHeader from "../components/PrimaryHeader";
import PrimaryLoader from "../components/PrimaryLoader";
import PrimaryTextField from "../components/PrimaryTextField";
import TransactionContainer, {
  TransactionContainerProps,
} from "../components/TransactionContainer";
import { CallbackTrigger } from "../constants/CallbackTrigger";
import colors from "../constants/Colors";
import { tabBarHeight } from "../constants/Constants";
import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";
import { PushNotificationsHandler } from "../constants/PushNotificationsHandler";
import { supabase } from "../constants/Supabase";
import { UIScale } from "../constants/UIScale";
import { UserSession } from "../constants/UserSession";

interface Props {
  navigation: NavigationProp<any>;
}

const TransactionsView: React.FC<Props> = ({ navigation }) => {
  const [moneyToSend, setMoneyToSend] = useState<string>("");
  const [usernameToSend, setUsernameToSend] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [isUsernameNotEmpty, setIsUsernameNotEmpty] = useState<boolean>(false);
  const [isMoneyToSendNotEmpty, setIsMoneyToSendNotEmpty] =
    useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionContainerProps[]>(
    []
  );
  const [myCurrencies, setMyCurrencies] = useState<CurrencyModel[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState<boolean>(true);
  const [selectedCurrencyFrom, setSelectedCurrencyFrom] =
    useState<CurrencyModel>(
      UserSession.loggedUser?.portifolio.length == 0
        ? CurrencyController.getCurrencyByCode("USD")!
        : CurrencyController.getCurrencyByCode(
            UserSession.loggedUser?.portifolio[0].code!
          )!
    );

  React.useEffect(() => {
    getMyPortfolioCurrencies();
    getRelatedTransactions();
  }, []);

  const handleCurrencyChangeFrom = (currency: CurrencyModel) => {
    if (UserSession.loggedUser?.portifolio.length == 0) {
      setBalance("0");
      return;
    }
    setSelectedCurrencyFrom(currency);
    setBalance(UserSession.loggedUser?.getBalanceIn(currency.code)!);
  };

  const getMyPortfolioCurrencies = async () => {
    try {
      setIsPortfolioLoading(true);
      if (UserSession.loggedUser?.portifolio.length == 0) {
        setIsPortfolioLoading(false);
        return;
      }
      const currencies: CurrencyModel[] = [];
      for (let i = 0; i < UserSession.loggedUser?.portifolio.length!; i++) {
        if (UserSession.loggedUser?.portifolio[i].amount != "0") {
          currencies.push(
            CurrencyController.getCurrencyByCode(
              UserSession.loggedUser?.portifolio[i].code!
            )!
          );
        }
      }
      setMyCurrencies(currencies);
      setSelectedCurrencyFrom(currencies[0]);
      setBalance(UserSession.loggedUser?.getBalanceIn(currencies[0].code)!);
      setMoneyToSend("");
      setUsernameToSend("");
      setIsPortfolioLoading(false);
    } catch (e) {
      setIsPortfolioLoading(false);
    }
  };

  const getRelatedTransactions = async () => {
    console.log("getRelatedTransactions");
    const userId = UserSession.loggedUser?.id;
    let { data, error } = await supabase.rpc("get_transactions_info", {
      user_id: userId,
    });

    if (error) {
      console.log(error);
    } else {
      const transactions: TransactionContainerProps[] = [];
      for (let i = 0; i < data!.length; i++) {
        transactions.push({
          currencyCode: data![i].currency_code,
          personInteractionName: data![i].username,
          wasSended: data![i].sent_by_me,
          amount: data![i].value,
        });
      }
      setTransactions(transactions);
    }
  };

  CallbackTrigger.addCallback("get-portfolio", getMyPortfolioCurrencies);
  CallbackTrigger.addCallback("get-transactions", getRelatedTransactions);

  const sendMoney = async () => {
    const hasMoney =
      await UserSession.loggedUser?.verifyIfUserHasThisAmountInThis(
        moneyToSend,
        selectedCurrencyFrom?.code!
      );

    if (hasMoney) {
      let { data, error } = await supabase.rpc("transfer_transaction", {
        transfer_currency_code: selectedCurrencyFrom?.code,
        username_from: UserSession.loggedUser?.username,
        username_to: usernameToSend,
        transfer_value: moneyToSend,
      });

      if (error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Transferência realizada com sucesso!");
        await PushNotificationsHandler.sendPushNotification(
          usernameToSend,
          "Você recebeu uma quantia de " + UserSession.loggedUser?.username!,
          "Você acabou de receber " +
            moneyToSend +
            " " +
            selectedCurrencyFrom?.code +
            " de " +
            UserSession.loggedUser?.username! +
            "!"
        );
        await UserSession.updateUserPortfolio();

        const newBalance = UserSession.loggedUser?.getBalanceIn(
          selectedCurrencyFrom?.code!
        )!;

        setBalance(newBalance);
        setMoneyToSend("");
        setUsernameToSend("");
        getRelatedTransactions();
      }
    } else {
      Alert.alert("Usuário não possui essa quantia nessa moeda! Pobre!");
      setMoneyToSend("");
      setUsernameToSend("");
    }
  };

  const handleMoneyChange = (text: string) => {
    if (text != "") {
      setIsMoneyToSendNotEmpty(true);
    } else {
      setIsMoneyToSendNotEmpty(false);
    }
    setMoneyToSend(text);
  };

  const handleUsernameChange = (text: string) => {
    if (text != "") {
      setIsUsernameNotEmpty(true);
    } else {
      setIsUsernameNotEmpty(false);
    }
    setUsernameToSend(text);
  };

  return (
    <View style={styles.container}>
      <PrimaryHeader title="Movimentações" />
      <View>
        {UserSession.loggedUser!.username == "" ? (
          <View
            style={{
              height: 200,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NoUserNameBox />
          </View>
        ) : isPortfolioLoading ? (
          <View
            style={{
              height: 200,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PrimaryLoader />
          </View>
        ) : (
          <ScrollView>
            {UserSession.loggedUser?.portifolio.length == 0 ? (
              <View
                style={{
                  height: 200,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.convertedValueText}>
                  Você não possui moedas!
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  alignContent: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.convertedValueText}>Enviar para:</Text>
                <PrimaryTextField
                  placeholder="Digite o usuário:"
                  onChangeText={handleUsernameChange}
                  style={styles.inputField}
                  containerStyle={{ width: 350 }}
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
                  <View style={{ marginVertical: 7 }}>
                    <Text
                      style={[
                        styles.balanceText,
                        {
                          paddingTop: 15,
                          paddingBottom: 8,
                        },
                      ]}
                    >
                      Saldo: {balance} {selectedCurrencyFrom.name}
                    </Text>
                  </View>
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
                <View style={{ width: 350, paddingBottom: 10 }}>
                  <PrimaryButton
                    disabled={!(isMoneyToSendNotEmpty && isUsernameNotEmpty)}
                    title="Enviar"
                    onPress={() => {
                      sendMoney();
                    }}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <ScrollView
          keyboardDismissMode="none"
          style={styles.transactionContainerScrollView}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + UIScale.insets.bottom,
          }}
        >
          {transactions.map((transaction, index) => (
            <TransactionContainer
              key={index}
              currencyCode={transaction.currencyCode}
              personInteractionName={transaction.personInteractionName}
              wasSended={transaction.wasSended}
              amount={transaction.amount}
            />
          ))}
        </ScrollView>
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
    paddingBottom: 10,
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
  transactionContainerScrollView: {
    flex: 1,
  },
});

export default TransactionsView;
