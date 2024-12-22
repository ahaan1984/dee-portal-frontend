import govtLogo from '../assets/govt_logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  return (
    <div className="flex justify-between align-center items-center px-6 py-3 mx-6 bg-white border-b">
      <div className="flex items-center space-x-4">
        <img
          src={govtLogo}
          alt="Logo"
          className="h-20"
        />
        <div>
        <h1 className="font-sans font-normal" style={{ fontSize: '20px', fontFamily: 'Open Sans, sans-serif' }}>
        GOVERNMENT OF ASSAM
          </h1>
          <h2 className="text-[#990000] font-normal" style={{ fontSize: '18px', fontFamily: 'Open Sans, sans-serif' }}>ELEMENTARY EDUCATION</h2>
          <h3 className="text-[#2A75BB] font-bold" style={{ fontSize: '15 px', fontFamily: 'Open Sans, sans-serif' }}>
            DIRECTORATE OF ELEMENTARY EDUCATION
          </h3>
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
