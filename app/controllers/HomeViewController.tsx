import { NavigationProp } from "@react-navigation/native";
import { injectable } from "inversify";
import React from "react";
import { CurrencyController } from "../constants/CurrencyController";
import { Initialization } from "../constants/Initialization";
import { supabase } from "../constants/Supabase";
import { UserSession } from "../constants/UserSession";

@injectable()
export class HomeViewController {
  title: string = "Home";
  loading: any;
  navigation: NavigationProp<any> | undefined;

  //NOVOS
  graphValues: number[] = [1, 2];
  sliceColors: string[] = [];
  totalValue: number = 0;
  portifolio: { code: string; amount: string }[] = [];

  async register(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    navigation: NavigationProp<any>
  ) {
    this.navigation = navigation;
    this.loading = setLoading;
    await Initialization.init();
  }

  async getPortfolio(): Promise<void> {
    console.log("getPortfoliaaaaaaaaaaaaao");
    this.loading(true);
    await UserSession.updateUserPortfolio();
    const totalValue2 =
      UserSession.loggedUser?.getPortifolioTotalValueInMainCurrency();
    console.log(totalValue2);
    let { data, error, status } = await supabase
      .from("user_portfolio")
      .select(`*`)
      .eq("user_id", UserSession.session!.user?.id);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      const values: number[] = [];
      var totalValue: number = 0;
      this.portifolio = [];
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].currency_code);
        const convertedValue = CurrencyController.convertCurrency(
          data[i].currency_code,
          UserSession.loggedUser?.mainCurrency!,
          data[i].amount
        );
        values.push(Number(convertedValue));
        totalValue += Number(convertedValue);
        this.portifolio.push({
          code: data[i].currency_code,
          amount: data[i].amount,
        });
      }

      this.totalValue = totalValue;
      this.graphValues = values;
      this.getRandomColors(this.graphValues.length);
    }
    this.loading(false);
  }

  private getRandomColors(length: number) {
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(this.getRandomColor());
    }
    this.sliceColors = colors;
  }

  private getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 1; i <= 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
