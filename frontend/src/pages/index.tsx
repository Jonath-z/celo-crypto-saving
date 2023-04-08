import Accounts from "@/components/Accounts";
import Page from "@/components/layout/Page";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Page>
        <Accounts />
      </Page>
    </main>
  );
}