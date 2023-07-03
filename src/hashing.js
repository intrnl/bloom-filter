/** @typedef {string} HashableInput */

/**
 * @callback Hasher
 * @param {HashableInput} element
 * @param {number} seed
 */

/**
 *
 * @param {Hasher} hasher
 * @param {HashableInput} element
 * @param {number} size
 * @param {number} hashCount
 * @param {number} seed
 * @returns {number[]}
 */
export const getIndices = (hasher, element, size, hashCount, seed) => {
	/** @type {number[]} */
	const indices = [];
	const hashes = hashTwice(hasher, element, seed);

	for (let i = 0; i < hashCount; i++) {
		indices.push(doubleHashing(i, hashes.f, hashes.s, size));
	}

	return indices;
};

/**
 * @param {Hasher} hasher
 * @param {HashableInput} element
 * @param {number} seed
 * @returns {{ f: number, s: number }}
 */
export const hashTwice = (hasher, element, seed) => {
	return {
		f: hasher(element, seed + 1),
		s: hasher(element, seed + 2),
	};
};

/**
 * @param {number} n
 * @param {number} hashA
 * @param {number} hashB
 * @param {number} size
 * @returns {number}
 */
export const doubleHashing = (n, hashA, hashB, size) => {
	return Math.abs((hashA + n * hashB + Math.floor((n ** 3 - n) / 6)) % size);
};
