/**
 * Simple test script for the parser until I actually get around to writing unit tests and whatnot.
 * Give it an xit file, then use the parser as you would IRL, ezpz.
 */

import { createRequire } from 'module';
import * as xit from './xit-parse.js';

const require = createRequire(import.meta.url);
const fs = require('fs');
const file = fs.readFileSync('./test.xit', 'utf-8');

console.log('\ntoObject:\n');
console.log(JSON.stringify(xit.toObject(file),null, 2));
console.log('\ntoString:\n');
console.log(xit.toString(xit.toObject(file)));