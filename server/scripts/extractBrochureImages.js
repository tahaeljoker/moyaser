import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve(process.cwd(), 'public/images/shamkha');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const possiblePdfs = [
  path.resolve(process.cwd(), 'مشروع تاون هاوس الشامخه.pdf'),
  path.resolve(process.cwd(), 'مشروع تاون هاوس الشامخة.pdf'),
  path.resolve(process.cwd(), 'shamkha.pdf'),
];

const targetFiles = [
  { name: 'hero-exterior.webp', label: 'الواجهة الخارجية — تاون هاوس الشامخة' },
  { name: 'interior-1.webp', label: 'مجلس الضيوف الفاخر' },
  { name: 'interior-2.webp', label: 'صالة الاستقبال والمعيشة' },
  { name: 'interior-3.webp', label: 'جناح الماستر الرئيسي' },
  { name: 'interior-4.webp', label: 'المطبخ وتوزيع المساحات' },
  { name: 'interior-5.webp', label: 'الإطلالات وجلسة السطح' },
  { name: 'masterplan.webp', label: 'المخطط العام للـ 24 وحدة' },
  { name: 'plan-a-1.webp', label: 'مخطط نموذج A' },
  { name: 'plan-b-1.webp', label: 'مخطط نموذج B' },
  { name: 'plan-c-1.webp', label: 'مخطط نموذج C' },
  { name: 'plan-d-1.webp', label: 'مخطط نموذج D' },
  { name: 'plan-e-1.webp', label: 'مخطط نموذج E' },
  { name: 'plan-f-1.webp', label: 'مخطط نموذج F' },
];

async function generateCleanPlaceholder(filename, label) {
  const dest = path.join(outputDir, filename);
  const svg = `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect x="40" y="40" width="1120" height="720" rx="24" fill="none" stroke="#059669" stroke-width="2" stroke-opacity="0.3"/>
      <text x="600" y="380" font-family="sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle" direction="rtl">${label}</text>
      <text x="600" y="440" font-family="sans-serif" font-size="20" fill="#a7f3d0" text-anchor="middle" direction="rtl">تاون هاوس الشامخة — شركة مُيسّر للتطوير العقاري</text>
    </svg>
  `;
  await sharp(Buffer.from(svg))
    .webp({ quality: 82 })
    .toFile(dest);
}

async function extractFromPdf(pdfPath) {
  console.log(`[Brochure Extractor] Reading PDF: ${pdfPath}`);
  const data = fs.readFileSync(pdfPath);
  
  // Scan for embedded JPEG streams
  const jpegs = [];
  let pos = 0;
  while (pos < data.length) {
    const start = data.indexOf(Buffer.from([0xff, 0xd8, 0xff]), pos);
    if (start === -1) break;
    const end = data.indexOf(Buffer.from([0xff, 0xd9]), start + 3);
    if (end === -1) break;
    const imgBuf = data.slice(start, end + 2);
    if (imgBuf.length > 20000) { // filter out icons/pushpins
      jpegs.push(imgBuf);
    }
    pos = end + 2;
  }

  console.log(`[Brochure Extractor] Found ${jpegs.length} high-res images in PDF.`);

  for (let i = 0; i < targetFiles.length; i++) {
    const target = targetFiles[i];
    const dest = path.join(outputDir, target.name);
    if (i < jpegs.length) {
      try {
        await sharp(jpegs[i])
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(dest);
        console.log(`  ✓ Created: ${target.name} from stream #${i}`);
      } catch (err) {
        console.warn(`  ! Fallback for ${target.name}: ${err.message}`);
        await generateCleanPlaceholder(target.name, target.label);
      }
    } else {
      await generateCleanPlaceholder(target.name, target.label);
      console.log(`  ✓ Generated placeholder: ${target.name}`);
    }
  }
}

async function main() {
  const foundPdf = possiblePdfs.find((p) => fs.existsSync(p));
  if (foundPdf) {
    await extractFromPdf(foundPdf);
  } else {
    console.log('[Brochure Extractor] "مشروع تاون هاوس الشامخه.pdf" not found in root yet.');
    console.log('[Brochure Extractor] Generating initial high-res WebP assets in public/images/shamkha/...');
    for (const t of targetFiles) {
      await generateCleanPlaceholder(t.name, t.label);
      console.log(`  ✓ Created: ${t.name}`);
    }
    console.log('[Brochure Extractor] Done. Place the PDF in root anytime and re-run "npm run extract-brochure".');
  }
}

main().catch(console.error);
