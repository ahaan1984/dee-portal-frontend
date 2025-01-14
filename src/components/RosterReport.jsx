import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import ExportToExcel from './ExportToExcel';

const RosterReport = () => {
  const [rosterData, setRosterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  const fetchRosterData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/roster-report', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRosterData(response.data);
      setTotalItems(response.data.length);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch roster data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRosterData();
  }, []);

  const paginatedData = rosterData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading roster data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200 max-w-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchRosterData}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roster Report</h1>
              <p className="text-sm text-gray-500 mt-1">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ExportToExcel 
                  fileLink={'http://localhost:5000/api/roster/excel'} 
                  fileName={"roster-report.xlsx"} 
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Sl. No.', 'Roster Point No.', 'Roster Point', 'Name of Teacher', 'Date of Joining',
                    'Whether belongs to SC / ST(P) / ST(H) / OBC-MOBC / General',
                    'Filled as UR or reserved for SC / ST(P) / ST(H) / OBC-MOBC', 'Remarks', 'District']
                    .map((header) => (
                    <th 
                      key={header} 
                      className="py-4 px-6 text-left text-sm font-semibold text-gray-700 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((row, index) => (
                  <tr 
                    key={row.rosterPointNo} 
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">
                      {row.rosterPointNo}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.rosterPoint}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {row.employee?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {formatDate(row.employee?.date_of_joining) || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.employee?.caste || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.rosterPoint}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.remarks || '-'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.district}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosterReport;