import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import sharp from 'sharp';
import { PDFDocument, PDFName } from 'pdf-lib';

const outputDir = path.resolve(process.cwd(), 'public/images/shamkha');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pdfPath = path.resolve(process.cwd(), 'shamkha-brochure.pdf');

async function extractAndSaveImage(streamObj, filename, maxWidth = 1600, quality = 82) {
  const w = parseInt(streamObj.dict.lookup(PDFName.of('Width')).toString(), 10);
  const h = parseInt(streamObj.dict.lookup(PDFName.of('Height')).toString(), 10);
  const compressed = streamObj.getContents();
  const uncompressed = zlib.inflateSync(compressed);

  const channels = uncompressed.length === w * h * 4 ? 4 : 3;
  const destPath = path.join(outputDir, filename);

  await sharp(uncompressed, { raw: { width: w, height: h, channels } })
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath);

  const stat = fs.statSync(destPath);
  console.log(`  ✓ Extracted ${filename} (${w}x${h} -> ${Math.round(stat.size / 1024)} KB)`);
}

async function run() {
  if (!fs.existsSync(pdfPath)) {
    console.error(`[Error] Brochure PDF not found at: ${pdfPath}`);
    process.exit(1);
  }

  console.log(`[Brochure Extractor] Loading ${pdfPath}...`);
  const pdfBytes = fs.readFileSync(pdfPath);
  const doc = await PDFDocument.load(pdfBytes);
  const pages = doc.getPages();
  console.log(`[Brochure Extractor] PDF loaded (${pages.length} pages). Extracting real assets...`);

  // 1. Hero Exterior (Page 2, /X5)
  const p2XObj = pages[1].node.Resources().lookup(PDFName.of('XObject'));
  const heroX5 = doc.context.lookup(p2XObj.dict.get(PDFName.of('X5')));
  await extractAndSaveImage(heroX5, 'hero-exterior.webp', 1600, 84);

  // 2. Interior Photos (Pages 6, 8, 12, 14, 22)
  const interiorDefs = [
    { pageNum: 6, out: 'interior-1.webp' },
    { pageNum: 8, out: 'interior-2.webp' },
    { pageNum: 12, out: 'interior-3.webp' },
    { pageNum: 14, out: 'interior-4.webp' },
    { pageNum: 22, out: 'interior-5.webp' },
  ];

  for (const item of interiorDefs) {
    const pageXObj = pages[item.pageNum - 1].node.Resources().lookup(PDFName.of('XObject'));
    const x11 = doc.context.lookup(pageXObj.dict.get(PDFName.of('X11')));
    const subRes = x11.dict.lookup(PDFName.of('Resources')).lookup(PDFName.of('XObject'));
    const x10 = doc.context.lookup(subRes.dict.get(PDFName.of('X10')));
    await extractAndSaveImage(x10, item.out, 1600, 82);
  }

  // 3. Masterplan (Page 15, /X26)
  const p15XObj = pages[14].node.Resources().lookup(PDFName.of('XObject'));
  const masterX26 = doc.context.lookup(p15XObj.dict.get(PDFName.of('X26')));
  await extractAndSaveImage(masterX26, 'masterplan.webp', 1600, 84);

  // 4. Floor Plans & Renders for Models A to F (Pages 16 to 21)
  const modelDefs = [
    { pageNum: 16, plan1: 'X16', plan2: 'X18', render: 'X14', prefix: 'a' },
    { pageNum: 17, plan1: 'X11', plan2: 'X13', render: 'X18', prefix: 'b' },
    { pageNum: 18, plan1: 'X14', plan2: 'X16', render: 'X18', prefix: 'c' },
    { pageNum: 19, plan1: 'X14', plan2: 'X16', render: 'X18', prefix: 'd' },
    { pageNum: 20, plan1: 'X14', plan2: 'X16', render: 'X18', prefix: 'e' },
    { pageNum: 21, plan1: 'X14', plan2: 'X16', render: 'X18', prefix: 'f' },
  ];

  for (const m of modelDefs) {
    const pageXObj = pages[m.pageNum - 1].node.Resources().lookup(PDFName.of('XObject'));
    if (m.plan1) {
      const p1Obj = doc.context.lookup(pageXObj.dict.get(PDFName.of(m.plan1)));
      await extractAndSaveImage(p1Obj, `plan-${m.prefix}-1.webp`, 1600, 82);
    }
    if (m.plan2) {
      const p2Obj = doc.context.lookup(pageXObj.dict.get(PDFName.of(m.plan2)));
      await extractAndSaveImage(p2Obj, `plan-${m.prefix}-2.webp`, 1600, 82);
    }
    if (m.render) {
      const rObj = doc.context.lookup(pageXObj.dict.get(PDFName.of(m.render)));
      await extractAndSaveImage(rObj, `render-${m.prefix}.webp`, 1600, 84);
    }
  }

  console.log('[Brochure Extractor] All official images successfully extracted and optimized to WebP!');
}

run().catch((err) => {
  console.error('[Brochure Extractor Error]', err);
  process.exit(1);
});
