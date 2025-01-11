import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;  // Declare autoTable properly
    lastAutoTable?: { finalY: number };  // Add lastAutoTable as an optional property
  }
}
