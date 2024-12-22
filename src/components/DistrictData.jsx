import { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('viewer'); // Default to 'viewer'

  useEffect(() => {
    fetchUserRole();
    fetchEmployeeData();
  }, []);

  const fetchUserRole = () => {
    // Simulate fetching user role from token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      });
      setEmployeeData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/create-employee');
  };

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading employee data: {error}</p>
        <button 
          onClick={fetchEmployeeData}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">Employee List</h1>
      {userRole === 'admin' || userRole === 'superadmin' ? (
        <button
          onClick={handleCreate}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Employee
        </button>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="py-2 px-4 border-b">Employee ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Designation</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Place of Posting</th>
              <th className="py-2 px-4 border-b">Date of Birth</th>
              <th className="py-2 px-4 border-b">Date of Joining</th>
              <th className="py-2 px-4 border-b">Cause of Vacancy</th>
              <th className="py-2 px-4 border-b">Caste</th>
              <th className="py-2 px-4 border-b">Reservation Status</th>
              <th className="py-2 px-4 border-b">PWD</th>
              <th className="py-2 px-4 border-b">Ex-Servicemen</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee) => (
              <tr key={employee.employee_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-center">{employee["S.No"]}</td>
                <td className="py-2 px-4 border-b text-center">{employee.employee_id}</td>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b whitespace-pre-wrap">{employee.designation}</td>
                <td className="py-2 px-4 border-b">{employee.gender}</td>
                <td className="py-2 px-4 border-b">{employee.place_of_posting}</td>
                <td className="py-2 px-4 border-b">{formatDate(employee.date_of_birth)}</td>
                <td className="py-2 px-4 border-b">{formatDate(employee.date_of_joining)}</td>
                <td className="py-2 px-4 border-b">{employee.cause_of_vacancy}</td>
                <td className="py-2 px-4 border-b">{employee.caste}</td>
                <td className="py-2 px-4 border-b">{employee.posted_against_reservation}</td>
                <td className="py-2 px-4 border-b text-center">
                  {employee.pwd ? 'Yes' : 'No'}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {employee.ex_servicemen ? 'Yes' : 'No'}
                </td>
                {(userRole === 'admin' || userRole === 'superadmin') && (
                    <button
                      // onClick={() => handleUpdate(employee.employee_id)}
                      className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                  )}
              {userRole === 'superadmin' && (
                    <button
                      // onClick={() => handleDelete(employee.employee_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default EmployeeList;
