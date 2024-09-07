const puppeteer = require("puppeteer");
const path = require('path');
const ejs = require('ejs');

async function generatePDFBuffer(data) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log(data);
  

  const html = await ejs.renderFile(path.join(__dirname, './../views', 'Check.ejs'), data);
  // HTMLni sahifaga qo‘shish
  await page.setContent(html);

  // PDFni buffer sifatida olish
  const pdfBuffer = await page.pdf({
    width: "80mm", // 80mm kenglikdagi format
    margin: {
      top: "0mm",
      bottom: "0mm",
      left: "0mm",
      right: "0mm",
    },
    printBackground: true, // Orqa fon ranglarini saqlash
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = { generatePDFBuffer };
