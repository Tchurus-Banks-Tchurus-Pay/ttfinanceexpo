import React from "react";
import {
  DimensionValue,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  height?: DimensionValue;
  width?: DimensionValue;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean; // Propriedade "disabled"
}

const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  height = 50,
  width = "100%",
  backgroundColor = "#60628a",
  containerStyle = {},
  textStyle = {},
  disabled = false, // Valor padrão para "disabled"
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { height, width, backgroundColor },
        containerStyle,
        disabled && styles.disabledButton, // Estilo para botão desativado
      ]}
      onPress={onPress}
      disabled={disabled} // Propriedade "disabled" do TouchableOpacity
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins",
  },
  disabledButton: {
    backgroundColor: "#ccc", // Estilo para botão desativado
  },
});

export default PrimaryButton;
