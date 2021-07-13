import {setUploadButton} from './form.js';
import {renderPictures} from './pictures.js';
import {renderBigPicture} from './big-picture.js';
import {getData} from './api.js';
import {showAlert} from './utils/show-alert.js';


getData((data) => {
  renderPictures(data);
  renderBigPicture(data);
}, (message) => showAlert(message));
setUploadButton();
