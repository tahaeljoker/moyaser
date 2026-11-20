/**
 * Arabic-safe CSV Export Utility
 * Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens Arabic text cleanly without mojibake.
 */

function escapeCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportToCsv(filename, headers = [], rows = []) {
  if (!rows || rows.length === 0) {
    alert('لا توجد بيانات متاحة للتصدير.');
    return;
  }

  const headerRow = headers.map(escapeCell).join(',');
  const dataRows = rows.map((row) => row.map(escapeCell).join(','));
  const csvContent = [headerRow, ...dataRows].join('\r\n');

  // Prepend UTF-8 BOM so Excel opens Arabic correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}