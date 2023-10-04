import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PieChart from "react-native-pie-chart";
import colors from "../constants/Colors";
import { CurrencyController } from "../constants/CurrencyController";
import { UserSession } from "../constants/UserSession";
import { UserCompletePortfolio } from "../model/UserModel";

interface PortifolioGraphProps {
  portfolio: UserCompletePortfolio[];
}

const PortifolioGraph: React.FC<PortifolioGraphProps> = ({ portfolio }) => {
  const widthAndHeight = 230;
  const convertedPortfolio = CurrencyController.convertPortfolioToCurrency(
    UserSession.loggedUser?.mainCurrency!,
    portfolio
  );

  const filteredPortfolio = convertedPortfolio.filter(
    (item) => Number(item.amount) != 0
  );
  const series = filteredPortfolio.map((item) => Number(item.amount));
  const sliceColor = filteredPortfolio.map((item) => item.currency.color);
  const mainCurrency = UserSession.loggedUser?.getMainCurrencyModel();
  const totalValue =
    UserSession.loggedUser?.getPortifolioTotalValueInMainCurrency();

  return (
    <View>
      {totalValue == 0 ? (
        <View>
          <Text style={{ color: "#fff", fontFamily: "Poppins" }}>
            Você ainda não possui moedas.
          </Text>
        </View>
      ) : (
        <View
          style={{ alignItems: "center", position: "relative", paddingTop: 10 }}
        >
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverRadius={0.7}
            coverFill={colors.primaryBackground}
          />
          <View
            style={{
              position: "absolute",
              top: widthAndHeight / 3,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ color: "white", fontFamily: "Poppins", fontSize: 18 }}
              >
                {mainCurrency?.symbol}
              </Text>
              <Text
                style={{ color: "white", fontFamily: "Poppins", fontSize: 24 }}
              >
                {totalValue?.toFixed(2)}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ paddingTop: 2 }}
          >
            {filteredPortfolio.map((item, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <MaterialCommunityIcons
                  name="circle-small"
                  color={item.currency.color}
                  size={50}
                />
                <Text style={{ color: "white", fontFamily: "Poppins" }}>
                  {item.currency.code}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default PortifolioGraph;
