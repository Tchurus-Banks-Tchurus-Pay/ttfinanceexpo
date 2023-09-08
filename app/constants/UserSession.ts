import { Session } from "@supabase/supabase-js";
import { UserModel } from "../model/UserModel";

export class UserSession {
  private static session: Session | null = null;
  private static loggedUser: UserModel | null = null;

  public static getSession(): Session | null {
    return this.session;
  }

  static async setSession(session: Session | null) {
    this.session = session;
    if (session) {
      this.loggedUser = await UserModel.getUserById(session.user?.id);
    }
  }
}
