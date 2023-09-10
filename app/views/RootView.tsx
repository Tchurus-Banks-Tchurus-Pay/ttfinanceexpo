import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { Text, View } from "react-native";
import { CallbackTrigger } from "../constants/CallbackTrigger";
import { tabBarHeight } from "../constants/Constants";
import ExchangeView from "./ExchangeView";
import { HomeViewStack } from "./HomeView";
import TransactionsView from "./TransactionsView";

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function RootView() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#ffffff",
        headerShown: false,
        tabBarStyle: {
          height: tabBarHeight,
          paddingHorizontal: 5,
          paddingTop: 5,
          paddingBottom: 5,
          backgroundColor: "#2b2c3e",
          position: "absolute",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={HomeViewStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            CallbackTrigger.triggerCallback("update-home-view");
          },
        }}
      />
      <Tab.Screen
        name="Conversion"
        component={ExchangeView}
        options={{
          tabBarLabel: "Convert",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="currency-usd"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Profile}
        options={{
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsView}
        listeners={{
          tabPress: (e) => {
            CallbackTrigger.triggerCallback("get-portfolio");
            CallbackTrigger.triggerCallback("get-transactions");
          },
        }}
        options={{
          tabBarLabel: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="swap-horizontal"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}