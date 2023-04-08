import React from "react";
import { BiWallet } from "react-icons/bi";
import { BiTransferAlt } from "react-icons/bi";
import { MdOutlineAccountBalance } from "react-icons/md";
import Button from "./Button";

const BottomNav = () => {
  return (
    <div className="flex justify-between items-baseline text-2xl absolute bottom-0 max-w-full w-full mx-auto py-3 border-t">
      <Button isActive={true} icon={<MdOutlineAccountBalance />} />
      <Button isActive={false} icon={<BiTransferAlt />} />
      <Button isActive={false} icon={<BiWallet />} />
    </div>
  );
};

export default BottomNav;
