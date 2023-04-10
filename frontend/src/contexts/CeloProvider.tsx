import { CeloProvider as Provider } from "@celo/react-celo";
import { ReactNode } from "react";

const CeloProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider
      dapp={{
        name: "Celo Crypto Saving",
        description:
          "A decentralized savings bank that enables users to open savings accounts for a variety of purposes, lock those accounts, and withdraw funds all in a completely secure and open environment.",
        url: "#",
        icon: "./web-logo.png",
      }}
    >
      {children}
    </Provider>
  );
};

export default CeloProvider;
