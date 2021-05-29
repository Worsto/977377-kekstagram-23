const getRandomInt = (min, max) => {
  min = min >= 0 ? min : 0;
  max = max >= 0 ? max : 0;

  return min < max ? Math.floor(Math.random() * (max - min + 1)) + min : getRandomInt(max, min);
};

const checkStringLength = (string, maxLength) => string.length <= maxLength;

window.getRandomInt = getRandomInt;
window.checkStringLength = checkStringLength;
