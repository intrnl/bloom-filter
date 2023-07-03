const imul = Math.imul;

/**
 * cyrb53a (c) 2023 bryc (github.com/bryc)
 * https://github.com/bryc/code/blob/6ea6fb59526d6e24d815cb076434868bbd5b8892/jshash/experimental/cyrb53.js
 * @param {string} str
 * @param {number} [seed]
 * @returns {number}
 */
export const cyrb53a = (str, seed = 0) => {
	let h1 = 0xdeadbeef ^ seed;
	let h2 = 0x41c6ce57 ^ seed;

	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = imul(h1 ^ ch, 0x85ebca77);
		h2 = imul(h2 ^ ch, 0xc2b2ae3d);
	}

	h1 ^= imul(h1 ^ (h2 >>> 15), 0x735a2d97);
	h2 ^= imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
	h1 ^= h2 >>> 16;
	h2 ^= h1 >>> 16;

	return 2097152 * (h2 >>> 0) + (h1 >>> 11);
};
