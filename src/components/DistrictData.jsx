import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('viewer');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [dobMonthQuery, setDobMonthQuery] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchUserRole();
    fetchEmployeeData();
    fetchDistricts();
  }, [currentPage]);

  const fetchUserRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        if (payload.role === 'district_admin') {
            setSelectedDistrict(payload.district); 
        }
    }
};;

  const fetchDistricts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/districts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDistricts(response.data);
    } catch (err) {
      console.error('Failed to fetch districts:', err.response || err.message);
    }
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    fetchEmployeeData(e.target.value);
  };

  const fetchEmployeeData = async (district) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
        params: { district },
      });
      setTotalItems(response.data.length);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = response.data.slice(startIndex, startIndex + itemsPerPage);
      setEmployeeData(paginatedData);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const extractMonth = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('default', { month: 'long' });
  };

  const filteredData = employeeData.filter((employee) => {
    const matchesName = employee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDOBMonth = dobMonthQuery
      ? extractMonth(employee.date_of_birth).toLowerCase().includes(dobMonthQuery.toLowerCase())
      : true;
    return matchesName && matchesDOBMonth;
  });
  

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/employees/${selectedEmployee.employee_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeData((prev) =>
        prev.filter((employee) => employee.employee_id !== selectedEmployee.employee_id)
      );
      setShowModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6">
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
          <p className="text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error loading employee data: {error}
          </p>
          <button 
            onClick={fetchEmployeeData}
            className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Employee List</h1>
            {(userRole === 'superadmin') && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/create-employee')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Employee
              </button>
              <button
                onClick={() => navigate('/pending-changes')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                View Pending Changes
              </button>
            </div>
          )}
          </div>

    {userRole !== 'district_admin' && (
        <div className="px-2 mt-4 mb-4">
            <label htmlFor="district-select" className="block text-sm font-medium text-gray-700">
                Filter by District:
            </label>
            <select
                id="district-select"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm"
            >
                <option value="">All Districts</option>
                {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                ))}
            </select>
        </div>
    )}
    <div className="px-2 my-4">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="px-2 mb-2">
            <input
              type="text"
              placeholder="Search by Month of DOB (e.g., January)"
              value={dobMonthQuery}
              onChange={(e) => setDobMonthQuery(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
      </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                {["S.No", "Employee ID", "Name", "Designation", "Gender", "Place of Posting", 
                  "Date of Birth", "Date of Joining", "Cause of Vacancy", "Caste", 
                  "Reservation Status", "Date of Retirement", "PWD", "Ex-Servicemen", "Actions"].map((header) => (
                  <th key={header} className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-blue-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {filteredData.map((employee) => (
                <tr key={employee.employee_id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4">{employee["S.No"]}</td>
                  <td className="py-3 px-4 font-medium">{employee.employee_id}</td>
                  <td className="py-3 px-4">{employee.name}</td>
                  <td className="py-3 px-4">{employee.designation}</td>
                  <td className="py-3 px-4">{employee.gender}</td>
                  <td className="py-3 px-4">{employee.place_of_posting}</td>
                  <td className="py-3 px-4">{formatDate(employee.date_of_birth)}</td>
                  <td className="py-3 px-4">{formatDate(employee.date_of_joining)}</td>
                  <td className="py-3 px-4">{employee.cause_of_vacancy}</td>
                  <td className="py-3 px-4">{employee.caste}</td>
                  <td className="py-3 px-4">{employee.posted_against_reservation}</td>
                  <td className="py-3 px-4">{formatDate(employee.date_of_retirement)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.pwd ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {employee.pwd ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.ex_servicemen ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {employee.ex_servicemen ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {(userRole === 'admin' || userRole === 'superadmin') && (
                        <button
                          onClick={() => navigate(`/update-employee/${employee.employee_id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Update"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {userRole === 'superadmin' && (
                        <button
                          onClick={() => handleDeleteClick(employee)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems/itemsPerPage)} 
          onPageChange={setCurrentPage}/>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete employee <span className="font-medium">{selectedEmployee.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;