import { Dimensions } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

export class UIScale {
  static insets: EdgeInsets;
  static deviceWidth: number = 0;
  static deviceHeight: number = 0;

  static init() {
    this.insets = useSafeAreaInsets();
    this.deviceWidth = Dimensions.get("window").width;
    this.deviceHeight = Dimensions.get("window").height;
  }
}
