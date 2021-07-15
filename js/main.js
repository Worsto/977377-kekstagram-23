import {setUploadButton} from './form.js';
import {renderPictures} from './pictures.js';
import {renderBigPicture} from './big-picture.js';
import {getData} from './api.js';
import {showAlert} from './utils/show-alert.js';
import {showFiltersBar} from './filter.js';
import {debounce} from './utils/debounce.js';
import './preview.js';

const RERENDER_DELAY = 500;

getData((data) => {
  renderPictures(data);
  renderBigPicture(data);
  showFiltersBar(data, debounce(renderPictures, RERENDER_DELAY));
}, (message) => showAlert(message));

setUploadButton();
