import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

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
    if (window.innerWidth >= 768) {
      setActiveDropdown(menu);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      setActiveDropdown(null);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleMobileDropdownClick = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-[#2A75BB] text-white relative">
      <div className="flex justify-between items-center px-4 py-3 md:hidden">
        <div className="flex items-center space-x-4">
          <div className="bg-red-600 px-4 py-2 rounded cursor-pointer">Main</div>
          <div className="cursor-pointer" onClick={handleHomeClick}>🏠</div>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 px-6 py-3 items-center">
        <li className="bg-red-600 px-4 py-2 rounded cursor-pointer">Main</li>
        <li className="hover:text-gray-300 cursor-pointer" onClick={handleHomeClick}>🏠</li>
        
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

        <a href="/contact">
          <li className="hover:text-gray-300 cursor-pointer">Contact Us</li>
        </a>
        <li className="hover:text-gray-300 cursor-pointer">More ☰</li>
      </ul>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2A75BB] absolute top-full left-0 w-full z-50">
          {Object.keys(dropdownMenus).map((menu, index) => (
            <div key={index} className="border-b border-blue-400">
              <div
                className="px-4 py-3 cursor-pointer flex justify-between items-center"
                onClick={() => handleMobileDropdownClick(menu)}
              >
                {menu}
                <span>{activeDropdown === menu ? "▼" : "▶"}</span>
              </div>
              {activeDropdown === menu && (
                <div className="bg-blue-800">
                  {dropdownMenus[menu].map((item, i) => (
                    <div key={i} className="block px-6 py-2 hover:bg-blue-700">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="/contact">
            <div className="px-4 py-3 border-b border-blue-400 hover:bg-blue-700">
              Contact Us
            </div>
          </a>
          <div className="px-4 py-3 hover:bg-blue-700">More</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;