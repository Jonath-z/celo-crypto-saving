import Accounts from "@/components/Accounts";
import WalletModal from "@/components/WalletModal";
import Page from "@/components/layout/Page";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Page>
        <Accounts />
        <WalletModal />
      </Page>
    </main>
  );
}
