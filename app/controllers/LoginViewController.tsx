import { NavigationProp } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { injectable } from "inversify";
import React from "react";
import { Alert } from "react-native";
import { supabase } from "../constants/Supabase";
import { UserSession } from "../constants/UserSession";

@injectable()
export class LoginViewController {
  title: string = "Login";
  loading: any;
  navigation: NavigationProp<any> | undefined;

  register(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigation: NavigationProp<any>
  ) {
    this.loading = setLoading;
    this.navigation = navigation;
  }

  goToRegisterView() {
    this.navigation?.navigate("register");
  }

  async handleLogin(email: string, password: string) {
    this.loading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      this.loading(false);
    } else {
      /*       console.log("entrou");
      let session: Session | null = (await supabase.auth.getSession()).data
        .session;
      console.log(session);
      console.log(session?.user?.id);
      console.log(session?.user?.email);
      await supabase.auth.signOut();
      let session2: Session | null = (await supabase.auth.getSession()).data
        .session;
      console.log(session2); */
      let session: Session | null = (await supabase.auth.getSession()).data
        .session;
      UserSession.setSession(session);
      this.navigation?.reset({
        index: 0,
        routes: [{ name: "root" }],
      });
      this.loading(false);
    }
  }
}
