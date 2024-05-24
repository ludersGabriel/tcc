const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");

async function createPdf() {
  const pdfDoc = await PDFDocument.create();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([800, 400]);

  const text = "Hello, World!";
  page.drawText(text, {
    x: 200,
    y: 300,
    size: 30,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync("output.pdf", pdfBytes);
}

createPdf()
  .then(() => {
    console.log("PDF created");
  })
  .catch((err) => console.log(err));
