import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import PrimaryButton from "./PrimaryButton";
import UIText from "./UIText";

interface Props {}

const NoUserNameBox: React.FC<Props> = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UIText style={{ fontSize: 16, textAlign: "center" }}>
        Você precisa preencher informações obrigatórias do Perfil.
      </UIText>
      <View style={{ paddingVertical: 16 }}>
        <PrimaryButton
          title="Preencher Perfil"
          width={250}
          onPress={() => navigation.navigate("account" as never)}
        />
      </View>
    </View>
  );
};
export default NoUserNameBox;
