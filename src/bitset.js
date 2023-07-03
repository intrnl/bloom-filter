import * as Base64 from './base64.js';

const BITS_PER_WORD = 8;

/**
 * @typedef {object} BitSet
 * @property {number} size
 * @property {Uint8Array} array
 */

/**
 * @param {number} size
 * @returns {BitSet}
 */
export const create = (size) => {
	const diff = BITS_PER_WORD - (size % BITS_PER_WORD);
	const s = size + ([0, 8].includes(diff) ? 0 : diff);

	return {
		size: s,
		array: new Uint8Array(Math.ceil(s / BITS_PER_WORD)),
	};
};

/**
 * Set the bit to true
 * @param {BitSet} set
 * @param {number} index
 */
export const add = (set, index) => {
	const word_index = Math.floor(index / BITS_PER_WORD);
	const mask = 1 << index % BITS_PER_WORD;

	set.array[word_index] = set.array[word_index] | mask;
};

/**
 * Returns the value of the bit at the given index
 * @param {BitSet} set
 * @param {number} index
 * @returns {boolean}
 */
export const has = (set, index) => {
	const word_index = Math.floor(index / BITS_PER_WORD);
	const mask = 1 << index % BITS_PER_WORD;

	return (set.array[word_index] & mask) !== 0;
};

/**
 * @typedef {object} SerializableBitSet
 * @property {number} s
 * @property {string} c
 */

/**
 * @param {BitSet} set
 * @returns {SerializableBitSet}
 */
export const toJSON = (set) => {
	return {
		s: set.size,
		c: Base64.encode(set.array),
	};
};

/**
 * @param {SerializableBitSet} json
 * @returns {BitSet}
 */
export const fromJSON = (json) => {
	return {
		size: json.s,
		array: Base64.decode(json.c),
	};
};
