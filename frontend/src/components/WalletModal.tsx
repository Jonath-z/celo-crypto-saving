import { useWalletModal } from "@/contexts/WalletModalProvider";
import ConnectWalletButton from "./Buttons/ConnectWalletButton";
import useOnClickOutside from "use-onclickoutside";
import { useRef } from "react";

const WalletModal = () => {
  const { isModalOpened, toggleModal } = useWalletModal();
  const outsideWalletRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(outsideWalletRef, toggleModal);

  return (
    <div
      ref={outsideWalletRef}
      className={`fixed inset-0 w-full z-30 h-full bg-black/30 backdrop-blur-sm ${
        !isModalOpened && "-translate-y-full"
      }`}
    >
      <div
        className={`bg-white z-50 fixed w-full bottom-0 h-fit pb-4 pt-10 rounded-t-xl ${
          isModalOpened ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <ConnectWalletButton />
        <div>
          <p>Balance: 0.3 Celo</p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
