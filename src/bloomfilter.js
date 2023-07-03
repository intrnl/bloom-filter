import * as BitSet from './bitset.js';
import { getIndices } from './hashing.js';
import { cyrb53a } from './utils.js';

/**
 * @param {number} items
 * @param {number} error_rate
 * @returns {{ size: number, hashes: string }}
 */
export const getOptimalSize = (items, error_rate) => {
	const size = Math.ceil(-(items * Math.log(error_rate)) / Math.LN2 ** 2);
	const hashes = Math.round((size / items) * Math.LN2);

	return { size, hashes };
};

/**
 * @typedef {object} BloomFilter
 * @property {number} size
 * @property {number} hashes
 * @property {number} seed
 * @property {import('./bitset.js').BitSet} filter
 * @property {import('./hashing.js').Hasher} hasher
 */

/**
 * @param {number} size
 * @param {number} string
 * @param {number} [seed]
 * @returns {BloomFilter}
 */
export const create = (size, hashes, seed = 0) => {
	return {
		size: size,
		hashes: hashes,
		seed: seed,
		filter: BitSet.create(size),
		hasher: cyrb53a,
	};
};

/**
 * @param {BloomFilter} bloom
 * @param {import('./hashing.js').HashableInput} element
 */
export const add = (bloom, element) => {
	const filter = bloom.filter;
	const indices = getIndices(bloom.hasher, element, bloom.size, bloom.hashes, bloom.seed);

	for (let i = 0, l = indices.length; i < l; i++) {
		const index = indices[i];
		BitSet.add(filter, index);
	}
};

/**
 * @param {BloomFilter} bloom
 * @param {import('./hashing.js').HashableInput} element
 * @returns {boolean}
 */
export const has = (bloom, element) => {
	const filter = bloom.filter;
	const indices = getIndices(bloom.hasher, element, bloom.size, bloom.hashes, bloom.seed);

	for (let i = 0, l = indices.length; i < l; i++) {
		const index = indices[i];

		if (!BitSet.has(filter, index)) {
			return false;
		}
	}

	return true;
};

/**
 * @typedef {object} SerializableBloomFilter
 * @property {number} s size
 * @property {number} h hashes
 * @property {number} e seed
 * @property {import('./bitset.js').SerializableBitSet} f filter
 */

/**
 * @param {BloomFilter} bloom
 * @returns {SerializableBloomFilter}
 */
export const toJSON = (bloom) => {
	return {
		s: bloom.size,
		h: bloom.hashes,
		e: bloom.seed,
		f: BitSet.toJSON(bloom.filter),
	};
};

/**
 * @param {SerializableBloomFilter} json
 * @returns {BloomFilter}
 */
export const fromJSON = (json) => {
	return {
		size: json.s,
		hashes: json.h,
		seed: json.e,
		filter: BitSet.fromJSON(json.f),
		hasher: cyrb53a,
	};
};
