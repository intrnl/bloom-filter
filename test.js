import tlds from 'tlds' assert { type: 'json' };

import { BloomFilter } from './src/index.js';

const { size, hashes } = BloomFilter.getOptimalSize(tlds.length, 0.025);
const bloom = BloomFilter.create(size, hashes);

for (let i = 0, l = tlds.length; i < l; i++) {
	BloomFilter.add(bloom, tlds[i]);
}

const test = (tld) => {
	console.log(tld, BloomFilter.has(bloom, tld));
};

test('invalid');
test('local');
test('localhost');
test('test');

test('xyz');
test('xyy');

console.log(JSON.stringify(BloomFilter.toJSON(bloom)));
