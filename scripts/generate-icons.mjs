#!/usr/bin/env node
/**
 * scripts/generate-icons.mjs
 * Generates extension PNG icons (16, 48, 128px) using only Node.js built-ins.
 * Design: dark navy background (#0f172a), blue rounded rect (#2563eb), white "S"
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Colours ─────────────────────────────────────────────────────────────────
const BG    = [15,  23,  42];   // #0f172a
const BLUE  = [37,  99, 235];   // #2563eb
const WHITE = [241, 245, 249];  // #f1f5f9

// ── "S" bitmaps ─────────────────────────────────────────────────────────────
// 7-wide bitmap used for 16 px
const S7 = [
  "0111110",
  "1100001",
  "1100000",
  "0111100",
  "0000110",
  "0000011",
  "1000011",
  "0111110",
];
// 11-wide bitmap used for 48 px and 128 px
const S11 = [
  "00111111100",
  "01110001110",
  "11100000110",
  "11100000000",
  "01110000000",
  "00111100000",
  "00001111000",
  "00000011100",
  "00000001110",
  "11000001110",
  "01110001110",
  "00111111100",
];

// ── CRC-32 ───────────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return ((crc ^ 0xffffffff) >>> 0);
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  const lb = Buffer.allocUnsafe(4);
  lb.writeUInt32BE(data.length);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([tb, data])));
  return Buffer.concat([lb, tb, data, crcBuf]);
}

// ── Geometry helpers ─────────────────────────────────────────────────────────
function inRoundedRect(px, py, size, r) {
  const x0 = r, x1 = size - 1 - r;
  const y0 = r, y1 = size - 1 - r;
  if (px >= x0 && px <= x1) return true;
  if (py >= y0 && py <= y1) return true;
  let cx, cy;
  if      (px < x0 && py < y0) { cx = x0; cy = y0; }
  else if (px > x1 && py < y0) { cx = x1; cy = y0; }
  else if (px < x0 && py > y1) { cx = x0; cy = y1; }
  else if (px > x1 && py > y1) { cx = x1; cy = y1; }
  else return false;
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
}

function inBitmap(px, py, size, bm) {
  const bh = bm.length, bw = bm[0].length;
  const pad = Math.round(size * 0.22);
  const aw = size - pad * 2, ah = size - pad * 2;
  const scale = Math.min(aw / bw, ah / bh);
  const ox = Math.floor((size - bw * scale) / 2);
  const oy = Math.floor((size - bh * scale) / 2);
  const bx = Math.floor((px - ox) / scale);
  const by = Math.floor((py - oy) / scale);
  if (bx < 0 || bx >= bw || by < 0 || by >= bh) return false;
  return bm[by][bx] === "1";
}

// ── PNG builder ──────────────────────────────────────────────────────────────
function buildPng(size) {
  const r  = Math.round(size * 0.2);
  const bm = size <= 24 ? S7 : S11;

  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = [0]; // filter None
    for (let x = 0; x < size; x++) {
      if (!inRoundedRect(x, y, size, r))  row.push(...BG);
      else if (inBitmap(x, y, size, bm)) row.push(...WHITE);
      else                                row.push(...BLUE);
    }
    rows.push(Buffer.from(row));
  }

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(Buffer.concat(rows))),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Write files ───────────────────────────────────────────────────────────────
const outDir = join(__dirname, "..", "extension", "public");
mkdirSync(outDir, { recursive: true });

for (const size of [16, 48, 128]) {
  const buf  = buildPng(size);
  const file = join(outDir, `icon${size}.png`);
  writeFileSync(file, buf);
  console.log(`✓ icon${size}.png  (${buf.length} bytes)`);
}
console.log("Icons generated.");
