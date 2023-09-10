import { NavigationProp } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { injectable } from "inversify";
import React from "react";
import { Alert } from "react-native";
import { supabase } from "../constants/Supabase";
import { UserSession } from "../constants/UserSession";

@injectable()
export class RegisterViewController {
  title: string = "Register";
  loading: any;
  navigation: NavigationProp<any> | undefined;
  session: Session | null = null;

  register(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigation: NavigationProp<any>
  ) {
    this.loading = setLoading;
    this.navigation = navigation;
  }

  async _handleLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  }

  async signUpWithEmail(email: string, password: string) {
    this.loading(true);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      this.loading(false);
    } else {
      console.log("User created successfully");
      let session: Session | null = (await supabase.auth.getSession()).data
        .session;
      await this._handleLogin(email, password);
      UserSession.setSession(session);
      this.loading(false);
    }
  }
}
