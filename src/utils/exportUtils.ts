
// import * as XLSX from 'xlsx';
// import { Transaction } from '@/context/TransactionContext';
// import { formatDate, formatTime } from './dateUtils';

// const getCategoryBackgroundColor = (category: string): string => {
//   const colors: Record<string, string> = {
//     food: 'FFA07A', // Light Salmon
//     transportation: 'ADD8E6', // Light Blue
//     entertainment: 'D8BFD8', // Thistle
//     shopping: 'FFB6C1', // Light Pink
//     utilities: 'FAFAD2', // Light Goldenrod Yellow
//     health: '90EE90', // Light Green 
//     education: 'B0C4DE', // Light Steel Blue
//     travel: 'AFEEEE', // Pale Turquoise
//     other: 'DCDCDC' // Gainsboro
//   };

//   return colors[category] || 'DCDCDC';
// };

// // Function to highlight positive and negative amounts
// const getAmountStyle = (transaction: Transaction) => {
//   if (transaction.isSavings) return { fgColor: { rgb: "4682B4" } }; // Steel Blue
//   return transaction.isExpense 
//     ? { fgColor: { rgb: "FFCCCB" } } // Light Red
//     : { fgColor: { rgb: "C1FFC1" } }; // Light Green
// };

// export const exportTransactionsToExcel = (
//   transactions: Transaction[], 
//   period: string = 'All Transactions'
// ) => {
//   // Sort transactions by date (newest first)
//   const sortedTransactions = [...transactions].sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   );

//   // Transform data for Excel
//   const data = sortedTransactions.map(transaction => {
//     const date = new Date(transaction.date);

//     return {
//       Date: formatDate(transaction.date),
//       Time: formatTime(transaction.date),
//       Description: transaction.description,
//       Category: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
//       Type: transaction.isSavings ? 'Savings' : (transaction.isExpense ? 'Expense' : 'Income'),
//       Amount: transaction.amount,
//       Notes: transaction.remarks || '',
//       'Savings Purpose': transaction.savingsPurpose || ''
//     };
//   });

//   // Create workbook
//   const wb = XLSX.utils.book_new();
//   const ws = XLSX.utils.json_to_sheet(data);

//   // Styling: Column widths
//   const columnWidths = [
//     { wch: 15 }, // Date
//     { wch: 10 }, // Time
//     { wch: 30 }, // Description
//     { wch: 15 }, // Category
//     { wch: 10 }, // Type
//     { wch: 12 }, // Amount
//     { wch: 25 }, // Notes
//     { wch: 25 }  // Savings Purpose
//   ];

//   ws['!cols'] = columnWidths;

//   // Add header row with styling
//   const headerRow = Object.keys(data[0] || {});
//   XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: "A1" });

//   // Apply styling to header row
//   const headerStyle = {
//     font: { bold: true, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "4F4FFF" } },
//     alignment: { horizontal: "center" }
//   };

//   // Apply styles
//   for (let i = 0; i < headerRow.length; i++) {
//     const cell = XLSX.utils.encode_cell({ c: i, r: 0 });
//     if (!ws[cell]) ws[cell] = { v: headerRow[i] };
//     ws[cell].s = headerStyle;
//   }

//   // Apply transaction styles
//   sortedTransactions.forEach((transaction, idx) => {
//     // Category cell styling
//     const categoryCell = XLSX.utils.encode_cell({ c: 3, r: idx + 1 });
//     if (ws[categoryCell]) {
//       ws[categoryCell].s = { 
//         fill: { fgColor: { rgb: getCategoryBackgroundColor(transaction.category) } },
//         alignment: { horizontal: "center" }
//       };
//     }

//     // Amount cell styling
//     const amountCell = XLSX.utils.encode_cell({ c: 5, r: idx + 1 });
//     if (ws[amountCell]) {
//       ws[amountCell].s = getAmountStyle(transaction); 
//     }

//     // Type cell styling
//     const typeCell = XLSX.utils.encode_cell({ c: 4, r: idx + 1 });
//     if (ws[typeCell]) {
//       ws[typeCell].s = getAmountStyle(transaction);
//     }
//   });

//   // Add summary section
//   const lastRow = data.length + 3;
//   const totalIncome = sortedTransactions
//     .filter(t => !t.isExpense)
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalExpenses = sortedTransactions
//     .filter(t => t.isExpense)
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalSavings = sortedTransactions
//     .filter(t => t.isSavings)
//     .reduce((sum, t) => sum + t.amount, 0);

//   const balance = totalIncome - totalExpenses;

//   // Add summary rows
//   XLSX.utils.sheet_add_aoa(ws, [
//     ["SUMMARY"], 
//     ["Total Income", totalIncome],
//     ["Total Expenses", totalExpenses],
//     ["Total Savings", totalSavings],
//     ["Balance", balance]
//   ], { origin: `A${lastRow}` });

//   // Style summary section
//   const summaryHeaderCell = XLSX.utils.encode_cell({ c: 0, r: lastRow - 1 });
//   ws[summaryHeaderCell].s = {
//     font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
//     fill: { fgColor: { rgb: "4F4FFF" } },
//     alignment: { horizontal: "center" }
//   };
//   ws["!mergeCell"] = XLSX.utils.encode_range(
//     { c: 0, r: lastRow - 1 },
//     { c: 7, r: lastRow - 1 }
//   );

//   // Add the sheet to workbook
//   XLSX.utils.book_append_sheet(wb, ws, period);

//   // Export to file
//   const fileName = `${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
//   XLSX.writeFile(wb, fileName);
// };
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Transaction } from '@/context/TransactionContext';
import { formatDate, formatTime } from './dateUtils';

export const exportTransactionsToExcel = (
  transactions: Transaction[],
  period: string = 'All Transactions'
) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const data = sortedTransactions.map(transaction => {
    return {
      Date: formatDate(transaction.date),
      Time: formatTime(transaction.date),
      Description: transaction.description,
      Category: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
      Type: transaction.isSavings ? 'Savings' : (transaction.isExpense ? 'Expense' : 'Income'),
      Amount: transaction.amount,
      Notes: transaction.remarks || '',
      'Savings Purpose': transaction.savingsPurpose || ''
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // Date
    { wch: 10 }, // Time
    { wch: 30 }, // Description
    { wch: 15 }, // Category
    { wch: 10 }, // Type
    { wch: 12 }, // Amount
    { wch: 25 }, // Notes
    { wch: 25 }  // Savings Purpose
  ];

  // Add headers manually
  const headerRow = Object.keys(data[0] || {});
  XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' });

  // Calculate summary values
  const lastRow = data.length + 3;
  const totalIncome = sortedTransactions
    .filter(t => !t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = sortedTransactions
    .filter(t => t.isExpense)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = sortedTransactions
    .filter(t => t.isSavings)
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Append summary section
  XLSX.utils.sheet_add_aoa(ws, [
    ['SUMMARY'],
    ['Total Income', totalIncome],
    ['Total Expenses', totalExpenses],
    ['Total Savings', totalSavings],
    ['Balance', balance]
  ], { origin: `A${lastRow}` });

  // Merge "SUMMARY" title row across 8 columns
  ws['!merges'] = [
    { s: { c: 0, r: lastRow - 1 }, e: { c: 7, r: lastRow - 1 } }
  ];

  // Append sheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, period);

  const fileName = `${period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

  // ✅ Use FileSaver to download (better for Capacitor + APK compatibility)
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};
