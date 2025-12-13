import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import dbConnect from '@/lib/db/mongodb';
import Invoice from '@/lib/models/Invoice';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfDoc = new PDFDocument({ size: 'A4' });
    let buffers: Buffer[] = [];

    pdfDoc.on('data', (chunk: Buffer) => {
      buffers.push(chunk);
    });

    pdfDoc.on('end', () => {
      // PDF generation complete
    });

    // Add content to PDF
    pdfDoc.fontSize(25).font('Helvetica-Bold').text('FACTURA', 50, 50);
    pdfDoc.fontSize(12).font('Helvetica').text(`N° ${invoice.invoiceNumber}`, 50, 90);

    // Company info
    pdfDoc.fontSize(10).text('DPU Labs SpA', 50, 130);
    pdfDoc.fontSize(9).text('Ciberseguridad - Pentesting', 50, 145);

    // Invoice details
    pdfDoc.fontSize(10).font('Helvetica-Bold').text('Detalles:', 50, 200);
    pdfDoc.fontSize(9).font('Helvetica');
    pdfDoc.text(`Cliente: ${invoice.clientId}`, 50, 220);
    pdfDoc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString('es-CL')}`, 50, 235);
    pdfDoc.text(`Vencimiento: ${new Date(invoice.dueDate).toLocaleDateString('es-CL')}`, 50, 250);
    pdfDoc.text(`Estado: ${invoice.status}`, 50, 265);

    // Items table
    pdfDoc.fontSize(10).font('Helvetica-Bold').text('Descripción', 50, 310);
    pdfDoc.text('Cantidad', 300, 310);
    pdfDoc.text('Precio', 400, 310);
    pdfDoc.text('Total', 480, 310);

    pdfDoc.moveTo(50, 325).lineTo(550, 325).stroke();

    let yPosition = 340;
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach((item: any) => {
        pdfDoc.fontSize(9).font('Helvetica');
        pdfDoc.text(item.description, 50, yPosition);
        pdfDoc.text(item.quantity.toString(), 300, yPosition);
        pdfDoc.text(`$${item.unitPrice.toLocaleString('es-CL')}`, 400, yPosition);
        pdfDoc.text(`$${item.total.toLocaleString('es-CL')}`, 480, yPosition);
        yPosition += 20;
      });
    } else {
      pdfDoc.fontSize(9).text(invoice.description, 50, yPosition);
      pdfDoc.text('1', 300, yPosition);
      pdfDoc.text(`$${invoice.amount.toLocaleString('es-CL')}`, 400, yPosition);
      pdfDoc.text(`$${invoice.amount.toLocaleString('es-CL')}`, 480, yPosition);
    }

    // Totals
    yPosition += 40;
    pdfDoc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 20;

    pdfDoc.fontSize(10).font('Helvetica-Bold');
    pdfDoc.text('Subtotal:', 350, yPosition);
    pdfDoc.text(`$${invoice.amount.toLocaleString('es-CL')}`, 480, yPosition);

    yPosition += 20;
    pdfDoc.text('IVA (19%):', 350, yPosition);
    pdfDoc.text(`$${invoice.tax.toLocaleString('es-CL')}`, 480, yPosition);

    yPosition += 20;
    pdfDoc.fontSize(12).text('TOTAL:', 350, yPosition);
    pdfDoc.text(`$${(invoice.amount + invoice.tax).toLocaleString('es-CL')}`, 480, yPosition);

    // Footer
    pdfDoc.fontSize(8).font('Helvetica').text('Documento generado automáticamente', 50, 700);

    pdfDoc.end();

    return new Promise<Response>((resolve) => {
      pdfDoc.on('finish', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(
          new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="factura-${invoice.invoiceNumber}.pdf"`,
            },
          })
        );
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
