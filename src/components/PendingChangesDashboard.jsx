import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const PendingChangesDashboard = () => {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchPendingChanges();
  }, []);

  const fetchPendingChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/pending-changes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending changes');
      }
      
      const data = await response.json();
      setChanges(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setProcessing(prev => ({ ...prev, [id]: true }));
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/pending-changes/${id}/${action}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} change`);
      }

      setChanges(prev => prev.filter(change => change.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const renderUpdatedData = (data) => {
    try {
      return Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-1">
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-gray-600">{JSON.stringify(value)}</span>
        </div>
      ));
    } catch {
      return <span className="text-gray-600">Invalid data format</span>;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Pending Changes</h1>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {changes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending changes to review
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {changes.map((change) => (
                  <tr key={change.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {change.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {change.requested_by}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      {renderUpdatedData(change.updated_data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                      <button
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => handleAction(change.id, 'approve')}
                        disabled={processing[change.id]}
                      >
                        {processing[change.id] && (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        )}
                        Approve
                      </button>
                      <button
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => handleAction(change.id, 'reject')}
                        disabled={processing[change.id]}
                      >
                        {processing[change.id] && (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        )}
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingChangesDashboard;