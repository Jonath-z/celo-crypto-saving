import { FC, ReactNode } from "react";
import BottomNav from "../BottomNav";
import Header from "../Header";

const Page: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-7xl md:mx-auto mx-3 md:px-0 relative h-screen overflow-hidden">
      <Header />
      <div className="absolute w-full h-full overflow-scroll pb-56">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default Page;
