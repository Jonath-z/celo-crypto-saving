import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IWalletContext {
  isModalOpened: boolean;
  setIsModalOpened: Dispatch<SetStateAction<boolean>>;
  toggleModal: () => void;
}

const defaultContext: IWalletContext = {
  isModalOpened: false,
  setIsModalOpened: () => null,
  toggleModal: () => null,
};

const WalletContext = createContext(defaultContext);

export const useWalletModal = () => useContext(WalletContext);

const WalletModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const toggleModal = () => setIsModalOpened((prev) => !prev);

  return (
    <WalletContext.Provider
      value={{ isModalOpened, toggleModal, setIsModalOpened }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletModalProvider;
