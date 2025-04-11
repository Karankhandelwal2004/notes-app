// src/utils/exportToPDF.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const exportToPDF = (notes) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('My Notes Summary', 14, 22);

  const tableData = notes.map((note, index) => [
    index + 1,
    note.title,
    note.content.length > 50 ? note.content.slice(0, 50) + '...' : note.content,
    new Date(note.createdAt).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['#', 'Title', 'Content Preview', 'Created At']],
    body: tableData,
  });

  doc.save('my-notes.pdf');
};

export default exportToPDF;
