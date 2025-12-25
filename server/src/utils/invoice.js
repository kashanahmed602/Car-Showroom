import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = async (sale, car, customer, employee, settings) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join(__dirname, '../../invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const invoicePath = path.join(invoiceDir, `invoice-${sale.invoiceNumber}.pdf`);
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(invoicePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text(settings.showroomName || 'Showroom', { align: 'center' });
      doc.fontSize(12).text('INVOICE', { align: 'center' }).moveDown();

      // Invoice details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${sale.invoiceNumber}`, 50, 120);
      doc.text(`Date: ${new Date(sale.saleDate).toLocaleDateString()}`, 50, 135);

      // Customer details
      doc.text('Bill To:', 350, 120);
      doc.text(customer.name, 350, 135);
      if (customer.address) doc.text(customer.address, 350, 150);
      if (customer.phone) doc.text(`Phone: ${customer.phone}`, 350, 165);

      doc.moveDown(2);

      // Line items
      const startY = 220;
      doc.fontSize(12).text('Item Details', 50, startY);
      doc.moveDown();

      doc.fontSize(10);
      doc.text(`${car.year} ${car.make} ${car.model}`, 50);
      doc.text(`Variant: ${car.variant || 'N/A'}`, 50);
      doc.text(`VIN: ${car.vin || 'N/A'}`, 50);
      doc.moveDown();

      // Price breakdown
      const priceY = doc.y;
      doc.text('Price:', 350, priceY);
      doc.text(`${settings.currency} ${sale.salePrice.toLocaleString()}`, 450, priceY, { align: 'right' });

      if (sale.discount > 0) {
        doc.text('Discount:', 350);
        doc.text(`-${settings.currency} ${sale.discount.toLocaleString()}`, 450, doc.y - 15, { align: 'right' });
      }

      const taxAmount = (sale.salePrice - sale.discount) * (settings.taxPercentage / 100);
      if (taxAmount > 0) {
        doc.text(`Tax (${settings.taxPercentage}%):`, 350);
        doc.text(`${settings.currency} ${taxAmount.toLocaleString()}`, 450, doc.y - 15, { align: 'right' });
      }

      const total = sale.salePrice - sale.discount + taxAmount;
      doc.fontSize(12).text('Total:', 350);
      doc.fontSize(12).text(`${settings.currency} ${total.toLocaleString()}`, 450, doc.y - 18, { align: 'right' });

      doc.moveDown(2);
      doc.fontSize(10);
      doc.text(`Payment Method: ${sale.paymentMethod}`, 50);
      doc.text(`Sold By: ${employee.name}`, 50);

      if (sale.notes) {
        doc.moveDown();
        doc.text(`Notes: ${sale.notes}`, 50);
      }

      // Footer
      doc.fontSize(8)
        .text('Thank you for your business!', 50, doc.page.height - 50, { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(invoicePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};


