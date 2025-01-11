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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Roster Report</h1>
        </div>
        
        <div className="overflow-x-auto">
        <div className="px-4 mt-4">
        <ExportToExcel fileLink={'http://localhost:5000/api/roster/excel'} fileName={"roster-report.xlsx"} />
        </div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {['Sl. No.', 'Roster Point No.', 'Roster Point', 'Name of Teacher', 'Date of Joining',
                  'Whether belongs to SC / ST(P) / ST(H) / OBC-MOBC / General',
                  'Filled as UR or reserved for SC / ST(P) / ST(H) / OBC-MOBC', 'Remarks', 'District']
                  .map((header) => (
                  <th key={header} className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr key={row.rosterPointNo} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-3 px-4">{row.rosterPointNo}</td>
                  <td className="py-3 px-4">{row.rosterPoint}</td>
                  <td className="py-3 px-4">{row.employee?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{formatDate(row.employee?.date_of_joining) || 'N/A'}</td>
                  <td className="py-3 px-4">{row.employee?.caste || 'N/A'}</td>
                  <td className="py-3 px-4">{row.rosterPoint}</td>
                  <td className="py-3 px-4">{row.remarks}</td>
                  <td className="py-3 px-4">{row.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default RosterReport;