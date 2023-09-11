import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Provider } from "inversify-react";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import container from "./app/constants/Inversify";
import { supabase } from "./app/constants/Supabase";
import { UIScale } from "./app/constants/UIScale";
import { UserSession } from "./app/constants/UserSession";
import LoginView from "./app/views/LoginView";
import RegisterView from "./app/views/RegisterView";
import RootView from "./app/views/RootView";
import SplashScreen from "./app/views/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [fontsLoaded, fontError] = useFonts({
    Poppins: require("./assets/fonts/poppins/Poppins-Regular.ttf"),
  });
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded && !fontError) {
      setAppLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      UserSession.setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(session);
      console.log(session?.user?.id);
      setSession(session);
      UserSession.setSession(session);
    });

    setTimeout(() => {
      setAppLoading(false);
    }, 2000);
  }, []);

  if (appLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <Provider container={container}>
        <NavigationContainer>
          {session && session.user ? <MyStack2 /> : <MyStack />}
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

function MyStack() {
  UIScale.init();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginView} />
      <Stack.Screen name="register" component={RegisterView} />
    </Stack.Navigator>
  );
}

function MyStack2() {
  UIScale.init();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="root" component={RootView} />
    </Stack.Navigator>
  );
}
