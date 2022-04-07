const express = require('express'),
  app = express(),
  port = process.env.PORT || 4000;

const PDFDocument = require('pdfkit');
const fs = require('fs');

app.get('/view-pdf', (req, res) => {

  const lorem = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  const doc = new PDFDocument();

  // vv The following line is the one you're looking for
  doc.pipe(res);

  // draw some text
  doc.fontSize(25).text('Here is some vector graphics...', 100, 80);

  // some vector graphics
  doc.save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill('#FF3300');

  doc.circle(280, 200, 50).fill('#6600FF');

  // an SVG path
  doc.scale(0.6)
    .translate(470, 130)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();

  // and some justified text wrapped into columns
  doc.text('And here is some wrapped text...', 100, 300)
    .font('Times-Roman', 13)
    .moveDown()
    .text(lorem, {
      width: 412,
      align: 'justify',
      indent: 30,
      columns: 2,
      height: 300,
      ellipsis: true
    });

  doc.end();

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
  });
});

app.get('/generate-pdf', (req, res) => {

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream('pdf-example.pdf'));

  doc.fontSize(27)
    .text('This is sample PDF', 100, 100);

  doc.image('upload/sample.jpg', {
    fit: [400, 400],
    align: 'center',
    valign: 'center'
  });

  doc.addPage()
    .fontSize(15)
    .text('Generating PDF with the help of PDFKit package', 100, 100);

  doc.addPage()
    .fillColor('blue')
    .text('Click here to visit the cluemediator.com website', 100, 100)
    .link(100, 100, 300, 27, 'https://www.cluemediator.com/');

  doc.end();
  res.send('PDF generated!');
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});