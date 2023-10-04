import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { UserCompletePortfolio } from "../model/UserModel";
import { currencyColors } from "./Constants";

export class CurrencyController {
  static currencies = new Array<CurrencyModel>();
  private static apiKey: string =
    "fca_live_KoZYTzwxnvuHgkT6Z5E2oBI8aaRF36iDsqwosb3W";

  static async initCurrencies() {
    this.currencies = [];
    await this.loadCurrencies();
    await this.loadDolarEquivalence();
  }

  static getCurrencyByCode(code: string): CurrencyModel | undefined {
    return this.currencies.find((c) => c.code === code);
  }

  static convertCurrency(from: string, to: string, value: string): string {
    const fromCurrency = this.currencies.find((c) => c.code === from);
    const toCurrency = this.currencies.find((c) => c.code === to);

    if (fromCurrency && toCurrency) {
      const convertedValue =
        (Number(value) * Number(fromCurrency.dolarEquivalence)) /
        Number(toCurrency.dolarEquivalence);
      return convertedValue.toFixed(2);
    } else {
      return "0.00";
    }
  }

  static convertPortfolioToCurrency(
    currencyCode: string,
    portfolio: UserCompletePortfolio[]
  ): UserCompletePortfolio[] {
    let completePortfolioConverted: UserCompletePortfolio[] = [];

    portfolio.forEach((item) => {
      completePortfolioConverted.push({
        currency: CurrencyController.getCurrencyByCode(item.currency.code)!,
        amount: this.convertCurrency(
          item.currency.code,
          currencyCode,
          item.amount
        ),
      });
    });

    return completePortfolioConverted;
  }

  static convertAllCurrenciesAndGetTotal(
    currencies: Record<string, string>,
    to: string
  ) {
    let total = 0;

    for (const currencyCode in currencies) {
      if (currencies.hasOwnProperty(currencyCode)) {
        const value = currencies[currencyCode];
        total += Number(this.convertCurrency(currencyCode, to, value));
      }
    }

    return total.toFixed(2);
  }

  private static verifyIfDataIsUpdated(timestamp: string): boolean {
    const currentTimestamp = new Date();
    const savedTimestamp = new Date(timestamp);

    savedTimestamp.setHours(savedTimestamp.getHours() + 6);

    if (currentTimestamp > savedTimestamp) {
      console.log("Dados desatualizados");
      return false;
    } else {
      console.log("Dados atualizados");
      return true;
    }
  }

  private static async loadDolarEquivalence() {
    try {
      const equivalencesData =
        await this.tryToGetDolarEquivalenceFromLocalStorage();

      if (
        equivalencesData &&
        this.verifyIfDataIsUpdated(equivalencesData.timestamp)
      ) {
        const equivalences = equivalencesData.data;
        for (const currency in equivalences) {
          const equivalence = equivalences[currency];
          const currencyModel = this.currencies.find(
            (c) => c.code === currency
          );
          if (currencyModel) {
            currencyModel.dolarEquivalence = (1 / equivalence).toFixed(4);
          }
        }
        return;
      } else {
        console.log("OBTENDO DADOS DE EQUIVALÊNCIA DA API");
        await this.getDolarEquivalencesFromApi();
      }
    } catch (error) {
      console.error("Erro ao carregar moedas:", error);
    }
  }

  private static async loadCurrencies() {
    try {
      const currenciesFromLocalStorage =
        await this.tryToGetCurrenciesFromLocalStorage();

      if (
        currenciesFromLocalStorage &&
        this.verifyIfDataIsUpdated(currenciesFromLocalStorage.timestamp)
      ) {
        const currencies = currenciesFromLocalStorage.data;
        for (const currency in currencies) {
          const currencyData = currencies[currency];
          this.currencies.push(
            new CurrencyModel(
              currencyData.name,
              currencyData.code,
              currencyData.symbol,
              null
            )
          );
        }
        return;
      } else {
        console.log("OBTENDO DADOS DE CURRENCIES DA API");
        await this.getCurrenciesFromApi();
      }
    } catch (error) {
      console.error("Erro ao carregar moedas:", error);
    }
  }

  private static async getDolarEquivalencesFromApi() {
    try {
      const response = await axios.get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        const equivalences = response.data.data;
        await this.saveDataOnLocalStorage(
          "dolar-equivalence",
          response.data.data
        );
        for (const currency in equivalences) {
          const equivalence = equivalences[currency];
          const currencyModel = this.currencies.find(
            (c) => c.code === currency
          );
          if (currencyModel) {
            currencyModel.dolarEquivalence = (1 / equivalence).toFixed(4);
          }
        }
      } else {
        console.error("Falha ao carregar equivalências");
      }
    } catch (error) {
      console.error("Falha ao carregar equivalências:", error);
    }
  }

  private static async getCurrenciesFromApi() {
    try {
      const response = await axios.get(
        `https://api.freecurrencyapi.com/v1/currencies?apikey=${this.apiKey}`
      );

      if (response.status === 200) {
        await this.saveDataOnLocalStorage("currencies", response.data.data);
        const currencies = response.data.data;
        for (const currency in currencies) {
          const currencyData = currencies[currency];
          this.currencies.push(
            new CurrencyModel(
              currencyData.name,
              currencyData.code,
              currencyData.symbol,
              null
            )
          );
        }
      } else {
        console.error("Falha ao carregar moedas");
      }
    } catch (error) {
      console.error("Erro ao carregar moedas:", error);
    }
  }

  private static async saveDataOnLocalStorage(key: string, value: any) {
    try {
      const timestamp = new Date().toISOString();
      const valueWithTimestamp = {
        timestamp,
        data: value,
      };
      const jsonValue = JSON.stringify(valueWithTimestamp);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(key, "SALVAS às:", timestamp);
    } catch (e) {
      console.error("Erro ao salvar moedas no local storage", e);
    }
  }

  private static async tryToGetCurrenciesFromLocalStorage(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem("currencies");
      if (value !== null) {
        console.log("CURRENCIES CARREGADOS DO LOCAL STORAGE");
        return JSON.parse(value);
      }
    } catch (e) {
      return null;
    }
  }

  public static getCurrencyColorByCode(code: string): String {
    return currencyColors[code as keyof typeof currencyColors];
  }

  private static async tryToGetDolarEquivalenceFromLocalStorage(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem("dolar-equivalence");
      if (value !== null) {
        console.log("DADOS DE EQUIVALÊNCIA CARREGADOS DO LOCAL STORAGE");
        return JSON.parse(value);
      }
    } catch (e) {
      return null;
    }
  }
}

export class CurrencyModel {
  constructor(
    public name: string,
    public code: string,
    public symbol: string,
    public dolarEquivalence: string | null
  ) {}

  public get color(): string {
    return currencyColors[this.code as keyof typeof currencyColors];
  }
}
