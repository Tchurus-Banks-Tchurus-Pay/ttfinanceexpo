import { supabase } from "../constants/Supabase";

export class UserModel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mainCurrency: string;

  constructor(data: Partial<UserModel> = {}) {
    this.id = data.id || "";
    this.name = data.name || "";
    this.username = data.username || "";
    this.avatar = data.avatar || "";
    this.mainCurrency = data.mainCurrency || "";
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
}
