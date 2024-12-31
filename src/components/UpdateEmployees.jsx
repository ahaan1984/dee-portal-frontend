import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateEmployee = () => {
  const { employee_id } = useParams();
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    designation: '',
    gender: '',
    place_of_posting: '',
    date_of_birth: '',
    date_of_joining: '',
    cause_of_vacancy: '',
    caste: '',
    posted_against_reservation: '',
    pwd: false,
    ex_servicemen: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/employees/${employee_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatDate = (isoString) =>
          isoString ? new Date(isoString).toISOString().split('T')[0] : '';

        setFormData({
          ...response.data,
          date_of_birth: formatDate(response.data.date_of_birth),
          date_of_joining: formatDate(response.data.date_of_joining),
          pwd: response.data.pwd === 1,
          ex_servicemen: response.data.ex_servicemen === 1,
        });

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch employee data');
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employee_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/employees/${employee_id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee');
    }
  };

  if (loading) {
    return <div>Loading employee data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Update Employee</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) =>
              key !== 'pwd' &&
              key !== 'ex_servicemen' &&
              key !== 'date_of_retirement' ? ( // Exclude 'date_of_retirement'
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type={key.includes('date') ? 'date' : 'text'}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required={!['cause_of_vacancy', 'caste'].includes(key)}
                    />
                  </div>
                ) : key !== 'date_of_retirement' ? ( // Check again for conditional rendering
                  <div className="flex items-center" key={key}>
                    <input
                      type="checkbox"
                      name={key}
                      checked={formData[key]}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                  </div>
                ) : null
              )}
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;
