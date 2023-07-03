const base64abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * @param {Uint8Array} uint8
 * @returns {string}
 */
export const encode = (uint8) => {
	const l = uint8.length;

	let result = '';
	let i = 0;

	for (i = 2; i < l; i += 3) {
		result += base64abc[uint8[i - 2] >> 2];
		result += base64abc[((uint8[i - 2] & 0x03) << 4) | (uint8[i - 1] >> 4)];
		result += base64abc[((uint8[i - 1] & 0x0f) << 2) | (uint8[i] >> 6)];
		result += base64abc[uint8[i] & 0x3f];
	}

	if (i === l + 1) {
		// 1 octet yet to write
		result += base64abc[uint8[i - 2] >> 2];
		result += base64abc[(uint8[i - 2] & 0x03) << 4];
		result += '==';
	}

	if (i === l) {
		// 2 octets yet to write
		result += base64abc[uint8[i - 2] >> 2];
		result += base64abc[((uint8[i - 2] & 0x03) << 4) | (uint8[i - 1] >> 4)];
		result += base64abc[(uint8[i - 1] & 0x0f) << 2];
		result += '=';
	}

	return result;
};

/**
 * @param {string} b64
 * @returns {Uint8Array}
 */
export const decode = (b64) => {
	const binString = atob(b64);
	const size = binString.length;
	const bytes = new Uint8Array(size);

	for (let i = 0; i < size; i++) {
		bytes[i] = binString.charCodeAt(i);
	}

	return bytes;
};
