import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  placeholder: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  keyboardType?: "default" | "numeric"; // Adicionando a propriedade keyboardType
}

const PrimaryTextField: React.FC<Props> = ({
  placeholder,
  onChangeText,
  isPassword = false,
  style = {},
  containerStyle = {},
  keyboardType = "default", // Definindo o valor padrão para 'default'
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTextChange = (text: string) => {
    // Adicionando validação para números decimais
    if (keyboardType === "numeric") {
      const regex = /^\d*\.?\d*$/; // Permite números e ponto decimal
      if (regex.test(text)) {
        onChangeText(text);
      }
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <TextInput
        style={[styles.input, style, isPassword && { paddingRight: 40 }]}
        placeholder={placeholder}
        placeholderTextColor="#727272"
        onChangeText={handleTextChange} // Usando a função com validação
        secureTextEntry={isPassword ? !showPassword : false}
        underlineColorAndroid="transparent"
        cursorColor={"#fff"}
        keyboardType={keyboardType} // Passando o keyboardType
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.togglePassword}
          onPress={togglePasswordVisibility}
        >
          {showPassword ? (
            <Ionicons name="eye-outline" size={24} color="#606482" />
          ) : (
            <Ionicons name="eye-off-outline" size={24} color="#606482" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins",
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#282a36",
    borderWidth: 1,
    borderColor: "#44475c",
    fontFamily: "Poppins",
  },
  togglePassword: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  togglePasswordText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Poppins",
  },
});

export default PrimaryTextField;
