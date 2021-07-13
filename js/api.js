import {showAlert} from './utils/show-alert.js';

const LINK_DATA = 'https://23.javascript.pages.academy/kekstagram/data';
const LINK_FORM = 'https://23.javascript.pages.academy/kekstagram';

const getData = (onSuccess) => {
  fetch(LINK_DATA)
    .then((response) => response.json())
    .then((data) => onSuccess(data))
    .catch(() => {
      showAlert('Не удалось загрузить данные. Попробуйте перезагрузить страницу');
    });
};

const sendData = (onSuccess, onError, body) => {
  fetch(
    LINK_FORM,
    {
      method: 'POST',
      body: body,
    },
  ).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      onError();
    }
  }).catch(() => {
    onError();
  });
};


export {getData, sendData};
