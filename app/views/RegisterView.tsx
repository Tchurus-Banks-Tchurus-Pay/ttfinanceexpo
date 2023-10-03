import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryTextField from "../components/PrimaryTextField";
import colors from "../constants/Colors";
import container from "../constants/Inversify";
import { RegisterViewController } from "../controllers/RegisterViewController";

interface Props {
  navigation: NavigationProp<any>;
}

const RegisterView: React.FC<Props> = ({ navigation }) => {
  const controller = container.get(RegisterViewController);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  controller.register(setLoading, navigation);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{controller.title}</Text>
        <PrimaryTextField
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          value={email}
        />
        <PrimaryTextField
          placeholder="Senha"
          onChangeText={(text) => setPassword(text)}
          isPassword={true}
        />
        <PrimaryTextField
          placeholder="Repita a Senha"
          onChangeText={(text) => setRepeatPassword(text)}
          isPassword={true}
        />
        <PrimaryButton
          title="Registrar"
          onPress={() => controller.signUpWithEmail(email, password)}
          disabled={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  signupText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
});

export default RegisterView;
