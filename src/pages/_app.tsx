import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "@contexts/AuthContext";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "src/styles/global";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>SGPG - Sistema de Gerenciamento do Projeto Guri</title>
      </Head>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </ChakraProvider>
  );
}
export default MyApp;
