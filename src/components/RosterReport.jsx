import { useEffect, useState } from 'react';
import axios from 'axios';

const RosterReport = () => {
  const [rosterData, setRosterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample roster structure parsed from Excel
  const rosterPoints = [
    { rosterPointNo: 1, rosterPoint: 'UR (PwD)', filters: { caste: 'UR', pwd: true } },
    { rosterPointNo: 2, rosterPoint: 'OBC/MOBC', filters: { caste: 'OBC/MOBC' } },
    { rosterPointNo: 3, rosterPoint: 'UR', filters: { caste: 'UR', pwd: false } },
    { rosterPointNo: 4, rosterPoint: 'UR', filters: { caste: 'UR', pwd: false } },
    { rosterPointNo: 5, rosterPoint: 'ST(P)', filters: { caste: 'STP' } },
  ];

  const fetchRosterData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const employees = response.data;
      const assignedData = [];
      const usedEmployeeIds = new Set(); // To track used employees

      rosterPoints.forEach((rosterPoint) => {
        // Filter employees based on roster point criteria
        const filteredEmployees = employees.filter((employee) => {
          return (
            !usedEmployeeIds.has(employee.employee_id) &&
            employee.caste === rosterPoint.filters.caste &&
            (rosterPoint.filters.pwd === undefined || employee.pwd === rosterPoint.filters.pwd)
          );
        });

        const assignedEmployee = filteredEmployees.length > 0 ? filteredEmployees[0] : null;

        if (assignedEmployee) {
          usedEmployeeIds.add(assignedEmployee.employee_id);
        }

        assignedData.push({
          ...rosterPoint,
          employee: assignedEmployee,
        });
      });

      setRosterData(assignedData);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch roster data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRosterData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Roster Report</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Roster Point No.</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Roster Point</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Designation</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Date of Joining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rosterData.map((row) => (
                <tr key={row.rosterPointNo} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{row.rosterPointNo}</td>
                  <td className="py-3 px-4">{row.rosterPoint}</td>
                  <td className="py-3 px-4">{row.employee?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{row.employee?.designation || 'N/A'}</td>
                  <td className="py-3 px-4">{row.employee?.date_of_joining || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterReport;
