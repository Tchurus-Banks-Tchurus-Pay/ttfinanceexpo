import { Session } from "@supabase/supabase-js";
import { UserModel } from "../model/UserModel";

export class UserSession {
  private static _session: Session | null = null;
  private static _loggedUser: UserModel | null = null;

  public static get session(): Session | null {
    return this._session;
  }

  public static get loggedUser(): UserModel | null {
    return this._loggedUser;
  }

  static async setSession(session: Session | null) {
    this._session = session;
    if (session) {
      this._loggedUser = await UserModel.getUserById(session.user?.id);
    }
  }

  static async updateLoggedUserInfo() {
    if (this._loggedUser != null) {
      await this._loggedUser.getThisUserInfo();
    }
  }

  static async updateUserPortfolio() {
    await this.setSession(this._session);
    console.log(this._loggedUser);
    if (this._loggedUser != null) {
      await this._loggedUser.updatePortfolio();
    }
  }
}
