import React from "react";
import { NativeBaseProvider } from "native-base";
import TelaLogin from "./(tabs)/auth/Login/login";
import TelaCadastro from "./(tabs)/auth/Cadastro/cadastro";
import TelaVerificacaoEmail from "./(tabs)/auth/Cadastro/verificacao";

export default function App() {
  return (
    <NativeBaseProvider>
      <TelaLogin />
      <TelaCadastro />
      <TelaVerificacaoEmail />
    </NativeBaseProvider>
  );
}
