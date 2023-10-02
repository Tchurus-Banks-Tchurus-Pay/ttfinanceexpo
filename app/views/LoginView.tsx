import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import PrimaryTextField from "../components/PrimaryTextField";
import colors from "../constants/Colors";
import container from "../constants/Inversify";
import { LoginViewController } from "../controllers/LoginViewController";

interface Props {
  navigation: NavigationProp<any>;
}

const LoginView: React.FC<Props> = ({ navigation }) => {
  const controller = container.get(LoginViewController);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  controller.register(setLoading, navigation);

  const entrar = () => {
    /*   navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    }); */
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={require("../../assets/tt-slogan-white.png")} style={
          {
            width: 250,
            height: 100,
            resizeMode: "contain",
            alignSelf: "center",
            marginBottom: 40,
          }
        }/>
        <PrimaryTextField
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <PrimaryTextField
          placeholder="Senha"
          onChangeText={(text) => setPassword(text)}
          isPassword={true}
        />
        <PrimaryButton
          title="Login"
          onPress={() => controller.handleLogin(email, password)}
          disabled={loading}
        />
      </View>
      <TouchableOpacity onPress={() => controller.goToRegisterView()}>
        <Text style={styles.signupText}>Criar uma conta</Text>
      </TouchableOpacity>
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

export default LoginView;
