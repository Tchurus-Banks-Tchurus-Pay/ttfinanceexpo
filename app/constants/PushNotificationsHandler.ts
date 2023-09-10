import messaging from "@react-native-firebase/messaging";
import Constants from "expo-constants";
import { supabase } from "./Supabase";

export class PushNotificationsHandler {
  private static _apiKey: string =
    "key=AAAAgadrFX4:APA91bE1ZONIJPV2gxBUSy8DGJo760L8fedxAeq9pDQysPP-yplGIp_YRKywImskjL3Uowihen4L3lXT08r32wFDvoPn1if9sEH9Tjr1GSQXmthE7IAN5nm2DhWkA9QTPuInzcl1L-hK";

  static async sendPushNotification(to: string, title: string, body: string) {
    console.log("Enviando notificação para111111:");
    console.log(to);
    const userIdToSend = await this._getUserIdByUsername(to);
    if (userIdToSend == null) {
      console.log("Usuário não encontrado");
      return;
    }

    const { data, error, status } = await supabase
      .from("firebase_token_user")
      .select("*")
      .eq("user_id", userIdToSend);

    if (error) {
      throw error;
    }

    if (data) {
      for (const user of data) {
        console.log("Enviando notificação para:");
        console.log(user.firebase_token);
        await this.send(user.firebase_token, title, body);
        console.log("Enviando notificação para:");
      }
    }
  }

  private static async send(
    userFirebaseToken: string,
    title: string,
    body: string
  ) {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: this._apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: userFirebaseToken,
        notification: {
          title: title,
          body: body,
          icon: "https://placeimg.com/250/250/people",
        },
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  static async registerToken() {
    const fcmToken = await messaging().getToken();
    const session = await supabase.auth.getSession();
    const deviceId = await Constants.installationId;
    if (fcmToken) {
      const user_id = session.data.session?.user.id;
      const device_id = deviceId;
      const { data, error, status } = await supabase
        .from("firebase_token_user")
        .upsert(
          [
            {
              firebase_token: fcmToken,
              user_id,
              device_id,
            },
          ],
          { onConflict: "device_id" }
        );

      if (error) {
        throw error;
      }
    }
  }

  static async removeToken() {}

  private static async _getUserIdByUsername(
    username: string
  ): Promise<String | null> {
    console.log("Buscando usuário por username");

    const { data, error, status } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username);

    if (error) {
      throw error;
    }

    if (data) {
      console.log("Usuário encontrado");
      console.log(data[0].id);
      return data[0].id;
    }
    return null;
  }
}
