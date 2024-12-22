import { useState } from 'react';
import axios from 'axios';
import govt_logo2 from '../assets/govt_logo2.png';
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
    <div className="min-h-screen bg-rose-50">
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-4">
          <img src={govt_logo2} alt="Government of Assam" className="h-16" />
          <div className="flex items-center gap-2">
            <img src="/education-icon.png" alt="Education Icon" className="h-12" />
            <div className="text-sm">
              <div>শিক্ষাৰ অধিকাৰ</div>
              <div>সৰ্বশিক্ষা অভিযান, অসম</div>
              <div>সকলোৱে শিক্ষা সৰ্বাংগীন মাধ্যম।</div>
            </div>
          </div>
        </div>
        <div className="text-orange-500">
          Help Line Numbers: +91-7032564969, 7207830969
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 flex gap-8">
        <div className="flex-1 bg-white rounded-lg p-8 shadow-md">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <img src="/shiksha-setu-logo.png" alt="Shiksha Setu" className="w-32 mx-auto mb-4" />
              <div className="text-xl font-semibold">SHIKSHA SETU AXOM</div>
            </div>
            <img src="/education-illustration.png" alt="Education" className="w-48" />
          </div>
          
          <h1 className="text-3xl text-orange-500 font-semibold mt-6">Department of School Education</h1>
          
          <div className="mt-4 space-y-4 text-gray-600">
            <p><span className="font-semibold">A</span> comprehensive digital platform with 360 degree information on schools, Staff & Students.</p>
            <p><span className="font-semibold">D</span>esigned to serve as a single sources of information for day-to-day administrative operations</p>
            <p><span className="font-semibold">E</span>nabler for the department to take timely and data-driven decisions for optimization of resources and improve overall performance.</p>
          </div>
        </div>

        <div className="w-96 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <label className="text-gray-600">Enter User Name</label>
              </div>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <label className="text-gray-600">Password</label>
              </div>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
            >
              LOGIN
            </button>

            <div className="text-center">
              <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center mt-8">
        <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default LoginPage;