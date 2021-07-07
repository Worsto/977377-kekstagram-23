import { getRandomPositiveInteger } from './get-random-positive-integer.js';

const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

export {getRandomArrayElement};
