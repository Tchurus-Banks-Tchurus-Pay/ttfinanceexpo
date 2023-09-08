import { Container } from "inversify";
import "reflect-metadata";
import { ExchangeViewController } from "../controllers/ExchangeViewController";
import { HomeViewController } from "../controllers/HomeViewController";
import { LoginViewController } from "../controllers/LoginViewController";
import { RegisterViewController } from "../controllers/RegisterViewController";

const container = new Container();

//AUTH
container.bind(LoginViewController).toSelf().inSingletonScope();
container.bind(RegisterViewController).toSelf().inSingletonScope();

//ROOT
container.bind(HomeViewController).toSelf().inSingletonScope();
container.bind(ExchangeViewController).toSelf().inSingletonScope();

export default container;
