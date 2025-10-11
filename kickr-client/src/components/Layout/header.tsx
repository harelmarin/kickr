'use client';

export const Header = () => {
  return (
    <header className="bg-primary text-white shadow-sm h-[5%] flex items-center justify-between border-b border-gray-700 ">
      <div>
        <h1 className="text-4xl font-bold header-title"> Kickr</h1>
      </div>
      <div className="flex gap-4">
        <nav className="flex gap-4 font-small">
          <h2 className="hover:text-gray-300 cursor-pointer transition-colors">Teams</h2>
          <h2 className="hover:text-gray-300 cursor-pointer transition-colors">Matches</h2>
          <h2 className="hover:text-gray-300 cursor-pointer transition-colors">Members</h2>
        </nav>
         <button className="px-2 shadow-2xl text-white header-title transition bg-secondary"> Login </button>
        <button> Register </button>
      </div>
    </header>
  );
};
