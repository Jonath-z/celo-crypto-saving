import CeloProvider from "@/contexts/CeloProvider";
import WalletModalProvider from "@/contexts/WalletModalProvider";
import "@/styles/globals.css";
import "@celo/react-celo/lib/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CeloProvider>
      <WalletModalProvider>
        <Component {...pageProps} />
      </WalletModalProvider>
    </CeloProvider>
  );
}
