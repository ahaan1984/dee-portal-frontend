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
        setFormData({
          ...response.data,
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Update Employee</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          key !== 'pwd' && key !== 'ex_servicemen' ? (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 capitalize">{key.replace(/_/g, ' ')}</label>
              <input
                type={key.includes('date') ? 'date' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required={!['cause_of_vacancy', 'caste'].includes(key)}
              />
            </div>
          ) : (
            <div className="flex items-center mb-4" key={key}>
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}</label>
            </div>
          )
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateEmployee;
