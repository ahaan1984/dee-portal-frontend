import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import ExportToExcel from './ExportToExcel';

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportData(response.data);
      setTotalItems(response.data.length);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch report data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-lg w-full mx-4">
          <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Unable to Load Report</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchReportData}
              className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Retry Loading</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportToExcel 
                  fileLink={'http://localhost:5000/api/reports/excel'} 
                  fileName={"siu-report.xlsx"} 
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      'S.No',
                      'Name of District',
                      'Name of Office',
                      'Name of Incumbent',
                      'Name of Post',
                      'Cause of Vacancy',
                      'Date of Vacancy',
                      'Creation No.',
                      'Retention No.',
                      'No. of Sanctioned Post',
                      'Man in Position',
                      'Name of Treasury',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.district}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.officeName}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.incumbentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.postName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.causeOfVacancy}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(row.dateOfVacancy)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.creationNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.retentionNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.sanctionedPost}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.manInPosition}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.treasuryName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems/itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;