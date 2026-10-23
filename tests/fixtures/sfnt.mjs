// Minimal reader for the TrueType/OpenType files the share card renders with:
// the table directory and the Unicode character map, nothing else.

const TRUETYPE = 0x00_01_00_00;
const OPENTYPE_CFF = 0x4f_54_54_4f; // "OTTO"

/** Table tags of an uncompressed sfnt font, or null for WOFF/WOFF2 and other files. */
export function sfntTables(buffer) {
	const flavor = buffer.readUInt32BE(0);
	if (flavor !== TRUETYPE && flavor !== OPENTYPE_CFF) {
		return null;
	}
	const tables = new Map();
	const count = buffer.readUInt16BE(4);
	for (let index = 0; index < count; index++) {
		const record = 12 + index * 16;
		tables.set(buffer.toString("latin1", record, record + 4), buffer.readUInt32BE(record + 8));
	}
	return tables;
}

function format4(buffer, start, into) {
	const segments = buffer.readUInt16BE(start + 6) / 2;
	const ends = start + 14;
	const starts = ends + segments * 2 + 2;
	const deltas = starts + segments * 2;
	const offsets = deltas + segments * 2;
	for (let segment = 0; segment < segments; segment++) {
		const first = buffer.readUInt16BE(starts + segment * 2);
		const last = buffer.readUInt16BE(ends + segment * 2);
		const delta = buffer.readUInt16BE(deltas + segment * 2);
		const rangeOffset = buffer.readUInt16BE(offsets + segment * 2);
		for (let code = first; code <= last && code !== 0xff_ff; code++) {
			let glyph;
			if (rangeOffset === 0) {
				glyph = (code + delta) % 0x1_00_00;
			} else {
				const at = offsets + segment * 2 + rangeOffset + (code - first) * 2;
				const raw = buffer.readUInt16BE(at);
				glyph = raw === 0 ? 0 : (raw + delta) % 0x1_00_00;
			}
			if (glyph !== 0) {
				into.add(code);
			}
		}
	}
}

function format12(buffer, start, into) {
	const groups = buffer.readUInt32BE(start + 12);
	for (let group = 0; group < groups; group++) {
		const record = start + 16 + group * 12;
		const first = buffer.readUInt32BE(record);
		const last = buffer.readUInt32BE(record + 4);
		for (let code = first; code <= last; code++) {
			into.add(code);
		}
	}
}

/** Every code point the font's Unicode cmap subtables map to a real glyph. */
export function sfntCodePoints(buffer) {
	const cmap = sfntTables(buffer)?.get("cmap");
	if (cmap === undefined) {
		return new Set();
	}
	const codes = new Set();
	const count = buffer.readUInt16BE(cmap + 2);
	for (let index = 0; index < count; index++) {
		const record = cmap + 4 + index * 8;
		const platform = buffer.readUInt16BE(record);
		const subtable = cmap + buffer.readUInt32BE(record + 4);
		const format = buffer.readUInt16BE(subtable);
		if (platform !== 0 && platform !== 3) {
			continue;
		}
		if (format === 4) {
			format4(buffer, subtable, codes);
		} else if (format === 12) {
			format12(buffer, subtable, codes);
		}
	}
	return codes;
}
