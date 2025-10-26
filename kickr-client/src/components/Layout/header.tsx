import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-primary text-white shadow-sm h-[5%] flex items-center justify-between border-b border-gray-700 mt-6">
      <div>
        <Link to="/" className="text-4xl font-bold header-title cursor-pointer">
          Kickr
        </Link>
      </div>

      <div className="flex gap-4 regular items-center">
        <nav className="flex gap-4 font-small mr-12">
          <h2 className="hover-secondary cursor-pointer transition-colors">
            Teams
          </h2>
          <h2 className="hover-secondary cursor-pointer transition-colors">
            Matches
          </h2>
          <h2 className="hover-secondary cursor-pointer transition-colors">
            Members
          </h2>
        </nav>
        <button className="hover-secondary cursor-pointer bold transition-colors">
          Login
        </button>
        <button className=" px-4 py-1 rounded-md text-white header-title transition bg-secondary opacity-100 hover:opacity-90 cursor-pointer text-lg">
          Register
        </button>
      </div>
    </header>
  );
};
