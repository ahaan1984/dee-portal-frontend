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
    if (userRole === 'superadmin' || userRole === 'admin') {
      fetchDistricts();
    }
  }, [currentPage, userRole]);

  const fetchUserRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      if (payload.role.includes('district')) {
        setSelectedDistrict(payload.district);
      }
    }
  };

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

  const showDistrictFilter = userRole === 'superadmin' || userRole === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-blue-100"></div>
          </div>
          <p className="text-blue-600 font-medium text-lg animate-pulse">
            Loading employee records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-l-4 border-red-500 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Data</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={fetchEmployeeData}
                  className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Loading
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 sm:p-8 border-b border-blue-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
              {userRole === 'superadmin' && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/create-employee')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Employee
                  </button>
                  <button
                    onClick={() => navigate('/pending-changes')}
                    className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pending Changes
                  </button>
                </div>
              )}
            </div>

            {/* Filters Section */}
            <div className={`mt-6 grid grid-cols-1 md:grid-cols-${showDistrictFilter ? '3' : '2'} gap-4`}>
            {showDistrictFilter && (
                <div className="space-y-1">
                  <label htmlFor="district-select" className="text-sm font-medium text-gray-700">
                    District Filter
                  </label>
                  <select
                    id="district-select"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">All Districts</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Name Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Birth Month</label>
                <input
                  type="text"
                  placeholder="e.g. January"
                  value={dobMonthQuery}
                  onChange={(e) => setDobMonthQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  {["S.No", "Employee ID", "Name", "Designation", "Gender", "Place of Posting", 
                    "Date of Birth", "Date of Joining", "Cause of Vacancy", "Caste", 
                    "Reservation Status", "Date of Retirement", "PWD", "Ex-Servicemen", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
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
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems/itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the record for <span className="font-medium">{selectedEmployee?.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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