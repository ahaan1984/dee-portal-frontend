import { useState } from "react";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownMenus = {
    "Information & Services": [
      "District-wise Block Mission Offices",
      "ePrastuti",
    ],
    Documents: [
      "Acts",
      "Forms",
      "Guidelines",
      "Notifications",
      "Publications",
      "Reports",
      "Rules",
      "Office Memorandum",
    ],
    "About Us": [
      "Who We Are",
      "What We Do",
      "History",
      "SSA District Mission Offices",
    ],
  };

  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-blue-600 text-white relative">
      <ul className="flex space-x-6 px-6 py-3 items-center">
        {/* Main */}
        <li className="bg-red-600 px-4 py-2 rounded cursor-pointer">Main</li>

        {/* Home Icon */}
        <li className="hover:text-gray-300 cursor-pointer">🏠</li>

        {/* Dropdown Menus */}
        {Object.keys(dropdownMenus).map((menu, index) => (
          <li
            key={index}
            className="relative hover:text-gray-300 cursor-pointer"
            onMouseEnter={() => handleMouseEnter(menu)}
            onMouseLeave={handleMouseLeave}
          >
            {menu} ▼
            {activeDropdown === menu && (
              <div className="absolute top-full left-0 w-64 bg-white text-black shadow-lg rounded mt-1 z-50">
                {dropdownMenus[menu].map((item, i) => (
                    <div key={i} className="block px-4 py-2 hover:bg-gray-200">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}

        {/* Contact Us */}
        <a href="/contact">
          <li className="hover:text-gray-300 cursor-pointer">Contact Us</li>
        </a>

        {/* More Button */}
        <li className="hover:text-gray-300 cursor-pointer">More ☰</li>

      </ul>
    </nav>
  );
};

export default Navbar;
