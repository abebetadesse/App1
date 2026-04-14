import { CSVLink } from 'react-csv';
export const exportToCSV = (data, filename = 'export.csv') => {
  const csvData = data.map(row => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
};
