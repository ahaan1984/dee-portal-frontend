import { useState, useEffect } from 'react';

const DistrictHierarchy = () => {
  const [districtData, setDistrictData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    fetchDistrictData();
  }, []);

  const fetchDistrictData = async () => {
    try {
      const response = await fetch('/normalized_district_data.json');
      if (!response.ok) {
        throw new Error('Failed to fetch district data');
      }
      const data = await response.json();
      setDistrictData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getSelectedDistrictData = () => {
    return districtData.find(item => item.district === selectedDistrict);
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
        <p className="text-red-600">Error loading district data: {error}</p>
        <button 
          onClick={fetchDistrictData}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select District
        </label>
        <select
          id="district-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Choose a district...</option>
          {districtData.map((item) => (
            <option key={item.district} value={item.district}>
              {item.district}
            </option>
          ))}
        </select>
      </div>

      {selectedDistrict && (
        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4">
            <h2 className="text-xl font-semibold text-gray-800">{selectedDistrict}</h2>
          </div>
          
          <div className="p-4 space-y-6">
            {getSelectedDistrictData()?.dis.length > 0 && (
              <div className="bg-white">
                <h3 className="text-lg font-medium text-gray-700 mb-3">District Inspection Schools</h3>
                <ul className="space-y-2 pl-4">
                  {getSelectedDistrictData().dis.map((dis, index) => (
                    <li key={index} className="text-gray-600">{dis}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {getSelectedDistrictData()?.beeo.length > 0 && (
              <div className="bg-white">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Block Elementary Education Offices</h3>
                <ul className="space-y-2 pl-4">
                  {getSelectedDistrictData().beeo.map((beeo, index) => (
                    <li key={index} className="text-gray-600">{beeo}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictHierarchy;