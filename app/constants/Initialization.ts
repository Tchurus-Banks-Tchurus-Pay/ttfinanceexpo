import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import { CallbackTrigger } from "./CallbackTrigger";
import { PushNotificationsHandler } from "./PushNotificationsHandler";

messaging().onMessage(async (remoteMessage) => {
  Alert.alert(
    remoteMessage.notification?.title ?? "Notificação",
    remoteMessage.notification?.body ?? "Corpo da notificação"
  );
  console.log(JSON.stringify(remoteMessage));
  await CallbackTrigger.triggerAll();
});

export class Initialization {
  static async init() {
    await this.requestUserPermission();
    await this.checkToken();
    await PushNotificationsHandler.registerToken();
  }

  static async requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      // console.log("Permissão concedida");
    } else {
      //  console.log("Permissão negada");
    }
  }

  static async checkToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      //console.log(fcmToken);
    }
  }
}
