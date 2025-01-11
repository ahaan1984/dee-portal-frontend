import axios from 'axios';

const ExportToExcel = ({ fileLink, fileName }) => {
    const handleExportToExcel = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(fileLink, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', 
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('Failed to export to Excel.');
        }
      };

      return (
        <button
        onClick={handleExportToExcel}
        className="mb-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Save as Worksheet
      </button>
      )
}

export default ExportToExcel;