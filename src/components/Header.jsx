import govtLogo from '../assets/govt_logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-white border-b">
      <div className="flex items-center space-x-4">
        <img
          src={govtLogo}
          alt="Logo"
          className="h-16 md:h-20"
        />
        <div className="text-center md:text-left">
          <h1 className="font-sans font-normal text-lg md:text-2xl" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            GOVERNMENT OF ASSAM
          </h1>
          <h2 className="text-[#990000] font-normal text-sm md:text-xl" style={{ fontFamily: 'Open Sans, sans-serif' }}>ELEMENTARY EDUCATION</h2>
          <h3 className="text-[#2A75BB] font-bold text-xs md:text-lg" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            DIRECTORATE OF ELEMENTARY EDUCATION
          </h3>
        </div>
      </div>


    </div>
  );
};

export default Header;