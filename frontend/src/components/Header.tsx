const Header = () => {
  return (
    <div className="flex justify-between items-center py-8 border-b font-Blinker">
      <h1 className="font-black text-3xl cursor-pointer">
        Celo Saving
      </h1>
      <button className="bg-black hidden md:block text-white min-w-[10rem] py-3 rounded font-semibold">
        Wallet
      </button>
    </div>
  );
};

export default Header;
