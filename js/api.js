import {showAlert} from './utils/show-alert.js';

const getData = (onSuccess) => {
  fetch('https://23.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        showAlert('Не удалось загрузить данные. Попробуйте перезагрузить страницу');
      }
    })
    .then((picturesData) => {
      onSuccess(picturesData);
    })
    .catch(() => {
      showAlert('Не удалось загрузить данные. Попробуйте перезагрузить страницу');
    });
};

const sendData = (onSuccess, onError, body) => {
  fetch(
    'https://23.javascript.pages.academy/kekstagram',
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
