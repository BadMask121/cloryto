import { AppProps } from "next/app";
import "../styles/home.scss";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
