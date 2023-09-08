import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PieChart from "react-native-pie-chart";
import MyCurrencyContainer from "../components/MyCurrencyContainer";
import colors from "../constants/Colors";
import { tabBarHeight } from "../constants/Constants";
import { CurrencyController } from "../constants/CurrencyController";
import container from "../constants/Inversify";
import { HomeViewController } from "../controllers/HomeViewController";

interface Props {
  navigation: NavigationProp<any>;
}

const HomeView: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const controller = container.get(HomeViewController);
  controller.register(setLoading, navigation);

  const widthAndHeight = 230;

  React.useEffect(() => {
    const fetchData = async () => {
      await CurrencyController.initCurrencies();
      await controller.getPortfolio();
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
          <TouchableOpacity onPress={() => console.log("Configurações")}>
            <Ionicons name="settings" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.topContainer, { backgroundColor: "#2b2c3e" }]}>
        {loading == false ? (
          <View>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={controller.graphValues}
              sliceColor={controller.sliceColors}
              coverRadius={0.7}
              coverFill={colors.primaryBackground}
            />
            <View style={styles.totalValueContainer}>
              <Text style={styles.currencySymbol}>$ </Text>
              <Text style={styles.totalValue}>
                {controller.totalValue.toFixed(2)}
              </Text>
              <Text style={styles.currencyCode}> USD</Text>
            </View>
          </View>
        ) : (
          <Text>Carregando...</Text>
        )}
      </View>
      {loading == false ? (
        <ScrollView
          style={[styles.bottomContainer, { backgroundColor: "#232537" }]}
          contentContainerStyle={{ paddingBottom: tabBarHeight }}
        >
          {controller.portifolio.map((currency, index) => (
            <MyCurrencyContainer
              key={currency.code}
              code={currency.code}
              amount={currency.amount}
            />
          ))}
        </ScrollView>
      ) : (
        <Text>Carregando...</Text>
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
  topContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 3,
  },
  totalValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "#fff",
  },
  totalValue: {
    fontSize: 36,
    fontFamily: "Poppins",
    color: "#fff",
  },
  currencyCode: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: "#fff",
  },
});

export default HomeView;
