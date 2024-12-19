import { Link } from "react-router-dom";

const Button = ({ to, label, className }) => {
  return (
    <Link to={to}>
      <button
        className={`px-4 py-2 rounded hover:bg-opacity-80 transition-all ${className}`}
      >
        {label}
      </button>
    </Link>
  );
};

export default Button;
