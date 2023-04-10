import React from "react";
import Button from "./Button";
import { useCelo } from "@celo/react-celo";
import { truncate } from "@/utils/truncate";

const ConnectWalletButton = () => {
  const { connect, address } = useCelo();

  return (
    <Button onClick={connect}>
      {address ? truncate(address) : "Connect wallet"}
    </Button>
  );
};

export default ConnectWalletButton;
