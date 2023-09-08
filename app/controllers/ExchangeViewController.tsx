import { injectable } from "inversify";
import { CurrencyController } from "../constants/CurrencyController";

@injectable()
export class ExchangeViewController {
  selectedCurrencyFrom = CurrencyController.currencies[0];
  selectedCurrencyTo = CurrencyController.currencies[1];
}
