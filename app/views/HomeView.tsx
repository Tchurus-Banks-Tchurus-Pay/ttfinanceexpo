import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MyCurrencyContainer from "../components/MyCurrencyContainer";
import PortifolioGraph from "../components/PortifolioGraph";
import PrimaryLoader from "../components/PrimaryLoader";
import { CallbackTrigger } from "../constants/CallbackTrigger";
import colors from "../constants/Colors";
import { tabBarHeight } from "../constants/Constants";
import { CurrencyController } from "../constants/CurrencyController";
import { UIScale } from "../constants/UIScale";
import { UserSession } from "../constants/UserSession";
import { UserCompletePortfolio } from "../model/UserModel";
import AccountView from "./AccountView";
import SettingsView from "./SettingsView";

const Stack = createStackNavigator();

interface Props {
  navigation: NavigationProp<any>;
}

const HomeView: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [portfolio, setUserCompletePortfolio] = useState<
    UserCompletePortfolio[]
  >([]);

  const _updateHomeView = async () => {
    await CurrencyController.initCurrencies();
    await UserSession.updateUserPortfolio();
    const completePortfolio = UserSession.loggedUser!.getCompletePortfolio();
    setUserCompletePortfolio(completePortfolio);
  };

  const goToSettings = () => {
    navigation.navigate("settings");
  };

  CallbackTrigger.addCallback("update-home-view", _updateHomeView);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await CurrencyController.initCurrencies();
      await UserSession.updateUserPortfolio();
      const completePortfolio = UserSession.loggedUser!.getCompletePortfolio();
      setUserCompletePortfolio(completePortfolio);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: "#2b2c3e" }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Portfolio</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => goToSettings()}>
            <Ionicons name="settings" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.graphContainer}>
        {loading == false ? (
          <View style={styles.graphContainer}>
            <PortifolioGraph portfolio={portfolio} />
          </View>
        ) : (
          <PrimaryLoader />
        )}
      </View>
      {loading == false ? (
        <View style={styles.secondContainer}>
          <ScrollView>
            {portfolio.map((item, index) => (
              <MyCurrencyContainer
                key={item.currency.code}
                code={item.currency.code}
                amount={item.amount}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.secondContainer}>
          <PrimaryLoader />
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
  graphContainer: {
    flex: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  secondContainer: {
    backgroundColor: colors.tertiaryBackground,
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: tabBarHeight,
  },
});

export default HomeView;

export function HomeViewStack() {
  UIScale.init();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeView} />
      <Stack.Screen name="settings" component={SettingsView} />
      <Stack.Screen name="account" component={AccountView} />
    </Stack.Navigator>
  );
}