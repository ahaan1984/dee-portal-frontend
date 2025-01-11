const Navbar = () => {

  return (
    <nav className="bg-blue-600 text-white relative">
      <ul className="flex space-x-6 px-6 py-3 items-center">
        <li className="bg-red-600 px-4 py-2 rounded cursor-pointer">Main</li>
        <a href="/dashboard">
        <li className="hover:text-gray-300 cursor-pointer">🏠</li>
        </a>

        <a href="/report">
          <li className="hover:text-gray-300 cursor-pointer">SIU Report</li>
        </a>
        <a href="/roster">
          <li className="hover:text-gray-300 cursor-pointer">Roster Report</li>
        </a>

        <a href="/contact">
          <li className="hover:text-gray-300 cursor-pointer">Contact Us</li>
        </a>

        <li className="hover:text-gray-300 cursor-pointer">More ☰</li>

      </ul>
    </nav>
  );
};

export default Navbar;
