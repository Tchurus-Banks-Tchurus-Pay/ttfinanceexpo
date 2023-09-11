import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const SplashScreen = () => {
  useEffect(() => {
    // Coloque aqui qualquer lógica adicional que você queira executar durante o carregamento

    // Por exemplo, você pode adicionar um temporizador para exibir a tela de splash por alguns segundos e, em seguida, navegar para a próxima tela.
    setTimeout(() => {
      // Navegue para a próxima tela, por exemplo, a tela de login ou registro.
      // Substitua 'navigation.navigate' pela navegação real que você está usando em seu aplicativo.
      // navigation.navigate('login'); // Exemplo de navegação para a tela de login
    }, 3000); // Tempo em milissegundos (3 segundos neste exemplo)
  }, []);

  return (
    <View style={styles.container}>
      <Text>Entrando no Tchurus Banks Tchurus Pay</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
