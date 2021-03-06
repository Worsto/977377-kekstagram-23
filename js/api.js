const LINK_DATA = 'https://23.javascript.pages.academy/kekstagram/data';
const LINK_FORM = 'https://23.javascript.pages.academy/kekstagram';

const getData = (onSuccess, onError) => {
  fetch(LINK_DATA)
    .then((response) => response.json())
    .then((data) => onSuccess(data))
    .catch(() => {
      onError('Не удалось загрузить данные. Попробуйте перезагрузить страницу');
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
    response.ok ? onSuccess() : onError();
  }).catch(() => {
    onError();
  });
};


export {getData, sendData};
