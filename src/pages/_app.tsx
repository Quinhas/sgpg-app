import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "src/styles/global";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>SGPG</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
