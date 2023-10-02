import React, { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";

const SplashScreen = () => {
  useEffect(() => {
    setTimeout(() => {
    }, 3000);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/splash.png')}
      style={styles.backgroundImage}
    >
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default SplashScreen;
