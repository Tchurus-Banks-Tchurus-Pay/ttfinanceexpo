import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

export class UIScale {
  static insets: EdgeInsets;

  static init() {
    this.insets = useSafeAreaInsets();
  }
}
