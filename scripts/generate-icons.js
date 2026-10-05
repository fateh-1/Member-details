import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generatePNG(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data: height scanlines, each line has 1 filter byte (0) + width * 4 RGBA bytes
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowLength);

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = width * 0.44;
  const headRadius = width * 0.15;
  const headY = cy - height * 0.14;
  const badgeCx = cx + width * 0.22;
  const badgeCy = cy + height * 0.20;
  const badgeR = width * 0.10;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);

      // Check badge circle
      const bdx = x - badgeCx;
      const bdy = y - badgeCy;
      const distBadge = Math.sqrt(bdx * bdx + bdy * bdy);

      // Check head circle
      const hdx = x - cx;
      const hdy = y - headY;
      const distHead = Math.sqrt(hdx * hdx + hdy * hdy);

      // Check body (trapezoid/ellipse)
      const bodyDx = Math.abs(dx);
      const bodyDy = y - (cy + height * 0.15);
      const inBody = bodyDy >= 0 && bodyDy <= height * 0.22 && bodyDx <= (width * 0.28 - bodyDy * 0.35);

      if (distBadge <= badgeR) {
        // Emerald Badge
        rawData[pxOffset] = 16;     // R
        rawData[pxOffset + 1] = 185; // G
        rawData[pxOffset + 2] = 129; // B
        rawData[pxOffset + 3] = 255; // A
      } else if (distHead <= headRadius || inBody) {
        // White avatar silhouette
        rawData[pxOffset] = 255;
        rawData[pxOffset + 1] = 255;
        rawData[pxOffset + 2] = 255;
        rawData[pxOffset + 3] = 255;
      } else if (isMaskable || distFromCenter <= outerRadius) {
        // Sky Blue background (#0284c7)
        rawData[pxOffset] = 2;
        rawData[pxOffset + 1] = 132;
        rawData[pxOffset + 2] = 199;
        rawData[pxOffset + 3] = 255;
      } else {
        // Transparent outside rounded squircle
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), generatePNG(32, 32, false));

console.log('Successfully generated all PWA PNG icons in /public!');
