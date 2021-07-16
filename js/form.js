import {sendData} from './api.js';

const HASHTAGS_MAX_COUNT = 5;
const REG_EXP_SHARP_FIRST = /^#[\s\S]*$/;
const REG_EXP_BODY = /^#[A-Za-zА-Яа-я0-9]*$/;
const REG_EXP_LENGTH = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const PICTURE_SCALE_STEP = 25;
const PICTURE_SCALE_DEFAULT = 100;
const PICTURE_SCALE_MAX = 100;
const PICTURE_SCALE_MIN = 25;
const DEFAULT_EFFECT = 'none';


const imgForm = document.querySelector('.img-upload__form');
const uploadFile = imgForm.querySelector('#upload-file');
const imgUploadOverlay = imgForm.querySelector('.img-upload__overlay');
const image = imgUploadOverlay.querySelector('.img-upload__preview img');
const scaleChanger = imgUploadOverlay.querySelector('.scale');
const scaleValue = imgUploadOverlay.querySelector('.scale__control--value');
const formEffects = imgUploadOverlay.querySelector('.effects');
const effectFieldset = imgUploadOverlay.querySelector('.effect-level');
const sliderElement = effectFieldset.querySelector('.effect-level__slider');
const effectValue = effectFieldset.querySelector('.effect-level__value');
let effect;
const effects = {
  'chrome': {
    filter: 'grayscale',
    step: 0.1,
    unit: '',
    min: 0,
    max: 1,
  },
  'sepia': {
    filter: 'sepia',
    step: 0.1,
    unit: '',
    min: 0,
    max: 1,
  },
  'marvin': {
    filter: 'invert',
    step: 1,
    unit: '%',
    min: 0,
    max: 100,
  },
  'phobos': {
    filter: 'blur',
    step: 0.1,
    unit: 'px',
    min: 0,
    max: 3,
  },
  'heat': {
    filter: 'brightness',
    step: 0.1,
    unit: '',
    min: 1,
    max: 3,
  },
};
const hashtagsInput = imgUploadOverlay.querySelector('.text__hashtags');
const descriptionInput = imgUploadOverlay.querySelector('.text__description');
const closeButton = imgUploadOverlay.querySelector('.img-upload__cancel');


const changeImgScale = (evt) => {
  let step = 0;
  let border;

  if (evt.target.matches('.scale__control--bigger')) {
    step = PICTURE_SCALE_STEP;
    border = `${PICTURE_SCALE_MAX}%`;
  } else if (evt.target.matches('.scale__control--smaller')) {
    step = -PICTURE_SCALE_STEP;
    border = `${PICTURE_SCALE_MIN}%`;
  }

  if (scaleValue.value !== border) {
    scaleValue.value = `${+scaleValue.value.slice(0, -1) + step}%`;
    image.style.transform = `scale(${+scaleValue.value.slice(0, -1) / 100})`;
    if (scaleValue.value === `${PICTURE_SCALE_DEFAULT}%`) {
      image.style.transform = '';
    }
  }
};


const applyEffect = (evt) => {
  image.classList.remove(`effects__preview--${effect}`);
  effect = evt.target.value;

  if (sliderElement.noUiSlider && effect !== DEFAULT_EFFECT) {
    sliderElement.noUiSlider.destroy();
  }

  if (effect === DEFAULT_EFFECT) {
    sliderElement.noUiSlider.destroy();
    image.style.filter = '';
    effectFieldset.style.display = DEFAULT_EFFECT;
    return;
  }
  effectFieldset.style.display = '';
  noUiSlider.create(sliderElement, {
    range: {
      min: effects[effect].min,
      max: effects[effect].max,
    },
    start: effects[effect].max,
    step: effects[effect].step,
  });

  sliderElement.noUiSlider.on('update', (_, handle, unencoded) => {
    effectValue.value = unencoded[handle];
    image.style.filter = `${effects[effect].filter}(${unencoded[handle] + effects[effect].unit})`;
  });
  image.classList.add(`effects__preview--${effect}`);
};

const onPopupEscPress = (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      evt.stopPropagation();
      return;
    }
    closeImgUploadForm();
  }
};

// function declaration сделано для линтера
function closeImgUploadForm() {
  imgUploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscPress);
  uploadFile.value = '';
  image.style.transform = '';
  image.style.filter = '';
  image.classList.remove(`effects__preview--${effect}`);
  if (sliderElement.noUiSlider && effect !== DEFAULT_EFFECT) {
    sliderElement.noUiSlider.destroy();
  }
  hashtagsInput.value = '';
  descriptionInput.value = '';
  imgUploadOverlay.querySelector('#effect-none').checked = true;
  scaleValue.value = `${PICTURE_SCALE_DEFAULT}%`;
}

const onCloseClick = () => {
  closeImgUploadForm();
};

const validateDescription = () => {
  const valueLength = descriptionInput.value.length;
  const maxLength = descriptionInput.getAttribute('maxlength');
  let customValidityMessage = '';

  if (valueLength > maxLength) {
    customValidityMessage = `Удалите лишние ${  valueLength - maxLength } симв.`;
  }
  descriptionInput.setCustomValidity(customValidityMessage);
};

const validateHashtags = () => {
  const hashtags = hashtagsInput.value.replace(/^\s+| +(?= )|\s+$/g,'').toLowerCase().split(' ');
  const hashtagsSet = new Set(hashtags);
  let customValidityMessage = '';

  switch (true) {
    case hashtags.length > HASHTAGS_MAX_COUNT:
      customValidityMessage = `Максимальное количество хэштегов ${HASHTAGS_MAX_COUNT}`;
      break;
    case !hashtags.every((elem) => REG_EXP_SHARP_FIRST.test(elem)):
      customValidityMessage = 'Хэштег может начинаться с символа решетки.';
      break;
    case !hashtags.every((elem) => REG_EXP_BODY.test(elem)):
      customValidityMessage = 'Хэштег может содержать только буквы.';
      break;
    case hashtags.some((elem) => elem === '#'):
      customValidityMessage = 'Хэштег не может быть пустым.';
      break;
    case !hashtags.every((elem) => REG_EXP_LENGTH.test(elem)):
      customValidityMessage = 'Хэштег не может быть длиннее 20 символов, включая решетку.';
      break;
    case hashtags.length !== hashtagsSet.size:
      customValidityMessage = 'Хэштег не должен повторяться.';
      break;
  }
  hashtagsInput.setCustomValidity(customValidityMessage);
};

const setFormSubmit = (onSuccess, onError) => {
  imgForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.target);

    sendData(onSuccess, onError, formData);
  });
};

const setPopupCloser = (status) => {
  const popup = document.querySelector(`.${status}`);
  const onEscPress = (evt) => {
    if (evt.key === 'Escape') {
      closePopup();
    }
  };

  const onVoidPress = (evt) => {
    if (evt.target.matches(`.${status}`)) {
      closePopup();
    }
  };

  // function declaration сделано для линтера
  function closePopup() {
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onVoidPress);
  }

  const button = document.querySelector(`.${status}__button`);
  button.addEventListener('click', closePopup);
  document.addEventListener('keydown', onEscPress);
  document.addEventListener('click', onVoidPress);
};

const showStatusMessage = (status) => {
  const template = document.querySelector(`#${status}`)
    .content
    .querySelector(`.${status}`);

  const element = template.cloneNode(true);
  element.setAttribute('id', `popup-${status}`);
  if (!document.querySelector(`#popup-${status}`)) {
    document.body.appendChild(element);
  } else {
    document.querySelector(`#popup-${status}`).classList.remove('hidden');
  }
};

const setFormSuccess = () => {
  closeImgUploadForm();
  showStatusMessage('success');
  setPopupCloser('success');
};

const setFormError = () => {
  closeImgUploadForm();
  showStatusMessage('error');
  setPopupCloser('error');
};

const showImgUploadForm = () => {
  imgUploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscPress);
  effectFieldset.style.display = DEFAULT_EFFECT;
  scaleChanger.addEventListener('click', changeImgScale);
  formEffects.addEventListener('change', applyEffect);
  closeButton.addEventListener('click', onCloseClick);
  descriptionInput.addEventListener('input', () => {
    validateDescription();
    descriptionInput.reportValidity();
  });
  hashtagsInput.addEventListener('input', () => {
    validateHashtags();
    hashtagsInput.reportValidity();
  });
  setFormSubmit(setFormSuccess, setFormError);
};

const setUploadButton = () => {
  uploadFile.addEventListener('change', showImgUploadForm);
};

export {setUploadButton};
