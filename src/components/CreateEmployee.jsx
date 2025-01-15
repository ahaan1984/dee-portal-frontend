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
    assembly_constituency: '',
    creation_no: '', 
    retention_no: '',
    man_in_position: '', 
    name_of_treasury: '',
    pwd: false,
    ex_servicemen: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const designations = ["Director", "Addl. Director", "Joint Director, Elementary Education",  
    "Deputy Director, Elementary Education", "Sr. Finance and Accounts Officer", "Finance & Accounts Officer", "O.S.D.", 
    "Astt. Dir. Elementary Education", "Evaluation and Monitoring Officer", "Accounts Officer", "Research Officer", 
    "Statistical Officer", "Registrar", "Inspecting Auditor", "Superintendent", "Asstt. Research Officer", "Asstt. Statistical Officer", 
    "Research Assistant", "Statistical Assistant", "Upper Division Assistant", "Progress Assistant", "Planning Assistant", 
    "Junior Assistant", "Stenographer", "Computor", "Driver", "Jamadar", "Duftry", "Peon", "Assistant Planning Officer"
  ];
  
  const districts = ['Baksa', 'Barpeta', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 
    'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 
    'Hailakandi', 'Jorhat', 'Kamrup Metropolitan', 'Kamrup', 'Karbi Anglong',
    'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 
    'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia',
    'Udalguri', 'West Karbi Anglong', 'Biswanath Chariali', 'Hojai', 'Bajali', 'Tamulpur'
  ];
  
  const genders = ["Male", "Female", "Other"];
  const causesOfVacancy = ["Retirement", "Expiry", "Transfer", "Resignation", "Termination"];
  const castes = ["UR", "SC", "STP", "STH", "OBC/MOBC", "EWS"];
  const reservations = ["Yes", "No"];

  const getDistrictFromID = (employeeID) => {
    if (!employeeID || employeeID.length < 2) return '';
    
    const districtCode = parseInt(employeeID.slice(0, 2));
    if (districtCode === 0) return '';
    
    if (districtCode > 0 && districtCode <= districts.length) {
      return districts[districtCode - 1];
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'employee_id') {
      const district = getDistrictFromID(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(district && { place_of_posting: district })
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Create Employee</h1>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Employee ID', name: 'employee_id', type: 'text', required: true },
                { label: 'Name', name: 'name', type: 'text', required: true },
                { label: 'Designation', name: 'designation', type: 'select', options: designations, required: true },
                { label: 'Gender', name: 'gender', type: 'select', options: genders, required: true },
                { label: 'Place of Posting', name: 'place_of_posting', type: 'select', options: districts, required: true },
                { label: 'Date of Birth', name: 'date_of_birth', type: 'date', required: true },
                { label: 'Date of Joining', name: 'date_of_joining', type: 'date', required: true },
                { label: 'Cause of Vacancy', name: 'cause_of_vacancy', type: 'select', options: causesOfVacancy },
                { label: 'Caste', name: 'caste', type: 'select', options: castes },
                { label: 'Posted Against Reservation', name: 'posted_against_reservation', type: 'select', options: reservations },
                { label: 'Assembly Constituency', name: 'assembly_constituency', type: 'text' },
                { label: 'Creation No', name: 'creation_no', type: 'text' },
                { label: 'Retention No', name: 'retention_no', type: 'text' },
                { label: 'Man in Position', name: 'man_in_position', type: 'text' },
                { label: 'Name of Treasury', name: 'name_of_treasury', type: 'text' }
              ].map(({ label, name, type, options, required }) => (
                <div className="space-y-2" key={name}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  {type === 'select' ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={name === 'place_of_posting' && formData.employee_id && formData.employee_id.length >= 2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required={required}
                    >
                      <option value="">{`Select ${label}`}</option>
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required={required}
                    />
                  )}
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-4 col-span-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    name="pwd"
                    checked={formData.pwd}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">PWD</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    name="ex_servicemen"
                    checked={formData.ex_servicemen}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Ex-Servicemen</span>
                </label>
              </div>
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
                Create Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;