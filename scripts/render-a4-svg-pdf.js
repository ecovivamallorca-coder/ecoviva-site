#!/usr/bin/env node
"use strict";

const fs = require("fs");
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");

const [input, output, widthText, heightText] = process.argv.slice(2);
if (!input || !output || !widthText || !heightText) {
  throw new Error("Usage: render-a4-svg-pdf.js INPUT.svg OUTPUT.pdf WIDTH_MM HEIGHT_MM");
}

const mm = 72 / 25.4;
const width = Number(widthText);
const height = Number(heightText);
const fontDir = "/System/Library/Fonts/Supplemental";
const fonts = {
  regular: `${fontDir}/Arial.ttf`,
  bold: `${fontDir}/Arial Bold.ttf`,
  italic: `${fontDir}/Arial Italic.ttf`,
  boldItalic: `${fontDir}/Arial Bold Italic.ttf`,
};

function fontCallback(_family, bold, italic) {
  if (bold && italic) return fonts.boldItalic;
  if (bold) return fonts.bold;
  if (italic) return fonts.italic;
  return fonts.regular;
}

const svg = fs.readFileSync(input, "utf8");
const doc = new PDFDocument({
  autoFirstPage: false,
  compress: true,
  info: {
    Title: "EcoViva Technical Library A4",
    Author: "EcoViva Mallorca S.L.",
  },
});
doc.pipe(fs.createWriteStream(output));
doc.addPage({ size: [width * mm, height * mm], margin: 0 });
SVGtoPDF(doc, svg, 0, 0, {
  width: width * mm,
  height: height * mm,
  preserveAspectRatio: "xMidYMid meet",
  fontCallback,
  assumePt: false,
  warningCallback: (message) => {
    if (!message.includes("Unknown")) process.stderr.write(`${message}\n`);
  },
});
doc.end();
