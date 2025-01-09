import { useState, useEffect } from 'react';
import axios from 'axios';

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch report data');
      setLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/reports/excel-siu', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Ensures the response is handled as a file
      });

      // Create a URL for the blob and initiate download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      alert('Failed to export to Excel.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReportData}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Report Page</h1>
      <button
        onClick={handleExportToExcel}
        className="mb-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Save as Worksheet
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
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
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{row.district}</td>
                <td className="px-4 py-2 border">{row.officeName}</td>
                <td className="px-4 py-2 border">{row.incumbentName}</td>
                <td className="px-4 py-2 border">{row.postName}</td>
                <td className="px-4 py-2 border">{row.causeOfVacancy}</td>
                <td className="px-4 py-2 border">{row.dateOfVacancy}</td>
                <td className="px-4 py-2 border">{row.creationNo}</td>
                <td className="px-4 py-2 border">{row.retentionNo}</td>
                <td className="px-4 py-2 border">{row.sanctionedPost}</td>
                <td className="px-4 py-2 border">{row.manInPosition}</td>
                <td className="px-4 py-2 border">{row.treasuryName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;
