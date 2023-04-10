import { accounts } from "@/mock";
import React from "react";
import AccountCard from "./cards/AccountCard";
import { nanoid } from "nanoid";

const Accounts = () => {
  return (
    <div className="flex flex-col gap-3 mt-5">
      <h2 className="text-3xl font-semibold">Accounts</h2>
      {accounts.map((account) => (
        <AccountCard key={nanoid()} account={account} />
      ))}
    </div>
  );
};

export default Accounts;
