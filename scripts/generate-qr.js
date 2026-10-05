import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const DEV_URL = 'https://ais-dev-e3uege3aujdqlftdejw7ck-797467860036.asia-southeast1.run.app';
const PRE_URL = 'https://ais-pre-e3uege3aujdqlftdejw7ck-797467860036.asia-southeast1.run.app';
const DEV_IPA_URL = `${DEV_URL}/api/download/ios-ipa`;

async function generateQRCodes() {
  console.log('[QR Generator] Generating QR codes for Dev URL and Pre URL...');

  // 1. Dev URL QR Code (Default active working container)
  const devSvg = await QRCode.toString(DEV_URL, {
    type: 'svg',
    color: { dark: '#0f172a', light: '#ffffff' },
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'qr-iphone-dev.svg'), devSvg);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'qr-iphone.svg'), devSvg); // Set default to dev so it works immediately

  await QRCode.toFile(path.join(PUBLIC_DIR, 'qr-iphone-dev.png'), DEV_URL, {
    color: { dark: '#0f172a', light: '#ffffff' },
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  await QRCode.toFile(path.join(PUBLIC_DIR, 'qr-iphone.png'), DEV_URL, {
    color: { dark: '#0f172a', light: '#ffffff' },
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
  });

  // 2. Pre URL QR Code (For once published)
  const preSvg = await QRCode.toString(PRE_URL, {
    type: 'svg',
    color: { dark: '#0f172a', light: '#ffffff' },
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'qr-iphone-pre.svg'), preSvg);

  await QRCode.toFile(path.join(PUBLIC_DIR, 'qr-iphone-pre.png'), PRE_URL, {
    color: { dark: '#0f172a', light: '#ffffff' },
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
  });

  // 3. IPA Direct Download QR Code
  const ipaSvg = await QRCode.toString(DEV_IPA_URL, {
    type: 'svg',
    color: { dark: '#0284c7', light: '#ffffff' },
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'qr-ipa.svg'), ipaSvg);

  await QRCode.toFile(path.join(PUBLIC_DIR, 'qr-ipa.png'), DEV_IPA_URL, {
    color: { dark: '#0284c7', light: '#ffffff' },
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
  });

  console.log('[QR Generator] Generated all QR codes successfully.');
}

generateQRCodes().catch((err) => {
  console.error('[QR Generator Error]', err);
  process.exit(1);
});
