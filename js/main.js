import './form.js';
import {renderPictures} from './pictures.js';
import {renderBigPicture} from './big-picture.js';
import {getData} from './api.js';

const render = (data) => {
  renderPictures(data);
  renderBigPicture(data);
};

getData(render);
