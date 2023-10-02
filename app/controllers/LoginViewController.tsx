import { NavigationProp } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { injectable } from "inversify";
import React from "react";
import { Alert } from "react-native";
import { supabase } from "../constants/Supabase";
import { UserSession } from "../constants/UserSession";

@injectable()
export class LoginViewController {
  title: string = "Tchurus-Bank-Tchurus-Pay";
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
      let session: Session | null = (await supabase.auth.getSession()).data
        .session;
      UserSession.setSession(session);
      this.loading(false);
    }
  }
}
