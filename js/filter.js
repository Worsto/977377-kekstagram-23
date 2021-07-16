import {shuffleArray} from './utils/shuffle-array.js';

const FILTER_RANDOM_COUNT = 10;

const filters = document.querySelector('.img-filters');
const filtersForm = filters.querySelector('.img-filters__form');
const FilterNames = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed',
};

const comparePictureComments = (pictureA, pictureB) => {
  const commentsA = pictureA.comments.length;
  const commentsB = pictureB.comments.length;

  return commentsB - commentsA;
};

const changeFilterButtonStyle = (status) => {
  filtersForm
    .querySelector('.img-filters__button--active')
    .classList
    .remove('img-filters__button--active');
  filtersForm
    .querySelector(`#filter-${status}`)
    .classList
    .add('img-filters__button--active');
};

const setFilter = (data, cb) => {
  filtersForm.addEventListener('click', (evt) => {
    let dataCopy = data.slice();
    const clickValue = evt.target.id;
    switch(clickValue) {
      case `filter-${FilterNames.DEFAULT}`:
        changeFilterButtonStyle(FilterNames.DEFAULT);
        break;
      case `filter-${FilterNames.RANDOM}`:
        changeFilterButtonStyle(FilterNames.RANDOM);
        shuffleArray(dataCopy);
        dataCopy = dataCopy.slice(0, FILTER_RANDOM_COUNT);
        break;
      case `filter-${FilterNames.DISCUSSED}`:
        changeFilterButtonStyle(FilterNames.DISCUSSED);
        dataCopy.sort(comparePictureComments);
        break;
    }
    cb(dataCopy);
  });
};

const showFiltersBar = (data, cb) => {
  filters.classList.remove('img-filters--inactive');
  setFilter(data, cb);
};

export {showFiltersBar};
