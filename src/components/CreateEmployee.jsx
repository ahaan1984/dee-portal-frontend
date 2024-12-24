import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
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
  const navigate = useNavigate();

  const designations = ["Manager", "Engineer", "Clerk", "Assistant"];
  const genders = ["Male", "Female", "Other"];
  const causesOfVacancy = ["Retirement", "Resignation", "Termination"];
  const castes = ["General", "OBC", "SC", "ST"];
  const reservations = ["Yes", "No"];

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
      await axios.post('http://localhost:5000/api/employees', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Create Employee</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Employee ID</label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Place of Posting</label>
          <input
            type="text"
            name="place_of_posting"
            value={formData.place_of_posting}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Joining</label>
          <input
            type="date"
            name="date_of_joining"
            value={formData.date_of_joining}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Cause of Vacancy</label>
          <select
            name="cause_of_vacancy"
            value={formData.cause_of_vacancy}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Cause of Vacancy</option>
            {causesOfVacancy.map((cause) => (
              <option key={cause} value={cause}>{cause}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Caste</label>
          <select
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Caste</option>
            {castes.map((caste) => (
              <option key={caste} value={caste}>{caste}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Posted Against Reservation</label>
          <select
            name="posted_against_reservation"
            value={formData.posted_against_reservation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Reservation Status</option>
            {reservations.map((reservation) => (
              <option key={reservation} value={reservation}>{reservation}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="pwd"
            checked={formData.pwd}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">PWD</label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="ex_servicemen"
            checked={formData.ex_servicemen}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Ex-Servicemen</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
