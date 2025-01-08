import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (['viewer', 'admin', 'superadmin'].includes(payload.role)) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <img src="govt_logo.png" alt="Government of Assam" className="h-16 w-16 object-contain" />
            <div className="font-medium">
              <div className="text-lg"> প্ৰাথমিক শিক্ষা সঞ্চালকালয়,অসম</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium">+91-7032564969, 7207830969</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 bg-white rounded-xl p-8 shadow-lg border border-blue-100">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">শিক্ষা সমন্বয়</h1>
                <h2 className="text-xl font-semibold text-blue-600 mt-4">Department of School Education</h2>
              </div>
              
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">A</span>
                  </div>
                  <p className="text-lg">Comprehensive digital platform with 360 degree information on schools, Staff & Students.</p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">D</span>
                  </div>
                  <p className="text-lg">Designed to serve as a single source of information for day-to-day administrative operations.</p>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">E</span>
                  </div>
                  <p className="text-lg">Enabler for the department to take timely and data-driven decisions for optimization of resources.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[440px] bg-white rounded-xl p-8 shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Welcome Back</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>User ID</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>

              <div className="text-center">
                <a href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;