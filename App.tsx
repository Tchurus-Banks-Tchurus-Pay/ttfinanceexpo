import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Provider } from "inversify-react";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";
import container from "./app/constants/Inversify";
import { supabase } from "./app/constants/Supabase";
import { UserSession } from "./app/constants/UserSession";
import LoginView from "./app/views/LoginView";
import RegisterView from "./app/views/RegisterView";
import RootView from "./app/views/RootView";

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      UserSession.setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      UserSession.setSession(session);
    });
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    Poppins: require("./assets/fonts/poppins/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider container={container}>
      <NavigationContainer>
        {session && session.user ? <MyStack2 /> : <MyStack />}
      </NavigationContainer>
    </Provider>
  );
}

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginView} />
      <Stack.Screen name="register" component={RegisterView} />
      <Stack.Screen name="root" component={RootView} />
    </Stack.Navigator>
  );
}

function MyStack2() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="root" component={RootView} />
    </Stack.Navigator>
  );
}
