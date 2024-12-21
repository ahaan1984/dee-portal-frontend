import { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployeeData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
