import { Account } from "@/types";
import { truncate } from "@/utils/truncate";
import Image from "next/image";
import React, { FC } from "react";
import { FiLock, FiUnlock } from "react-icons/fi";

const Lock = ({ locked }: { locked: boolean }) =>
  locked ? <FiLock /> : <FiUnlock />;

const AccountCard: FC<{ account: Account }> = ({ account }) => {
  const {
    owner,
    accountName,
    description,
    amount,
    lockTime,
    accountId,
  } = account;

  return (
    <div className="border border-gray-100  p-4 flex flex-col gap-1 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <p>{accountName}</p>
        {/* TODO: Should a logic to check if a account is locked */}
        <Lock locked={false} />
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <Image
          src="/celo-logo.png"
          alt="celo logo"
          width={20}
          height={20}
          className="rounded-full"
        />
        {truncate(owner)}
      </div>
      <div>
        <p>
          <span className="text-2xl font-bold">{amount}</span>{" "}
          <span>Celo</span>
        </p>
      </div>
    </div>
  );
};

export default AccountCard;
