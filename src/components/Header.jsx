import govtLogo from '../assets/govt_logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  return (
    <div className="flex justify-between align-center items-center px-6 py-3 mx-6 bg-white border-b">
      {/* Left: Logo and Text */}
      <div className="flex items-center space-x-4">
        <img
          src={govtLogo}
          alt="Logo"
          className="h-12"
        />
        <div>
          <h1 className="text-lg font-bold text-gray-800">
            GOVERNMENT OF ASSAM
          </h1>
          <h2 className="text-lg text-red-600 font-bold">ELEMENTARY EDUCATION</h2>
          {/* <h3 className="text-lg text-blue-600 font-bold">
            SAMAGRA SHIKSHA AXOM
          </h3> */}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="bg-blue-600 text-white p-2 rounded-r">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
};

export default Header;
