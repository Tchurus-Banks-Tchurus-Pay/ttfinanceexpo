import React from "react";
import { Text, TextProps } from "react-native";

interface UITextProps extends TextProps {
  children: React.ReactNode;
}

const UIText: React.FC<UITextProps> = ({ children, style, ...restProps }) => {
  return (
    <Text
      style={[{ color: "white", fontFamily: "Poppins" }, style]}
      {...restProps}
    >
      {children}
    </Text>
  );
};

export default UIText;
