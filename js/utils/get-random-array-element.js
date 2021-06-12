import { getRandomPositiveInteger } from './get-random-positive-integer.js';

export const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];
