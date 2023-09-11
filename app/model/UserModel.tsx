import {
  CurrencyController,
  CurrencyModel,
} from "../constants/CurrencyController";
import { supabase } from "../constants/Supabase";

export interface UserCompletePortfolio {
  currency: CurrencyModel;
  amount: string;
}

export class UserModel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mainCurrency: string;
  portifolio: { code: string; amount: string }[] = [];

  constructor(data: Partial<UserModel> = {}) {
    this.id = data.id || "";
    this.name = data.name || "";
    this.username = data.username || "";
    this.avatar = data.avatar || "";
    this.mainCurrency = data.mainCurrency || "USD";
    this.portifolio = data.portifolio || [];
  }

  static async getUserById(id: string): Promise<UserModel> {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    return new UserModel({
      id: data?.id,
      name: data?.full_name,
      avatar: data?.avatar_url,
      username: data?.username,
      mainCurrency: data?.main_currency_code,
    });
  }

  async updatePortfolio(): Promise<void> {
    let { data, error, status } = await supabase
      .from("user_portfolio")
      .select(`*`)
      .eq("user_id", this.id);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      this.portifolio = [];
      for (let i = 0; i < data.length; i++) {
        this.portifolio.push({
          code: data[i].currency_code,
          amount: data[i].amount,
        });
      }
    }
  }

  getPortifolioTotalValueIn(currencyCode: string): number {
    let totalValue = 0;
    this.portifolio.forEach((item) => {
      totalValue += Number(
        CurrencyController.convertCurrency(item.code, currencyCode, item.amount)
      );
    });
    return totalValue;
  }

  getPortifolioTotalValueInMainCurrency(): number {
    let totalValue = 0;
    this.portifolio.forEach((item) => {
      totalValue += Number(
        CurrencyController.convertCurrency(
          item.code,
          this.mainCurrency,
          item.amount
        )
      );
    });
    return totalValue;
  }

  getMainCurrencyModel(): CurrencyModel {
    return CurrencyController.getCurrencyByCode(this.mainCurrency)!;
  }

  async verifyIfUserHasThisAmountInThis(
    amount: string,
    currencyCode: string
  ): Promise<boolean> {
    await this.updatePortfolio();
    let hasThisAmount = false;
    this.portifolio.forEach((item) => {
      if (item.code === currencyCode && Number(item.amount) >= Number(amount)) {
        hasThisAmount = true;
      }
    });
    return hasThisAmount;
  }

  getBalanceIn(currencyCode: string): string {
    let balance = 0;

    this.portifolio.forEach((item) => {
      if (item.code === currencyCode) {
        balance = Number(item.amount);
      }
    });

    return balance.toFixed(2);
  }

  getCompletePortfolio(): UserCompletePortfolio[] {
    let completePortfolio: UserCompletePortfolio[] = [];
    this.portifolio.forEach((item) => {
      completePortfolio.push({
        currency: CurrencyController.getCurrencyByCode(item.code)!,
        amount: item.amount,
      });
    });
    return completePortfolio;
  }

  async getThisUserInfo() {
    let { data, error, status } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("id", this.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    this.name = data?.full_name || "";
    this.avatar = data?.avatar_url || "";
    this.username = data?.username || "";
    this.mainCurrency = data?.main_currency_code || "USD";
  }
}
