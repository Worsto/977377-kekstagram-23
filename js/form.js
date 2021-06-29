import './../nouislider/nouislider.js';

const SCALE_STEP = 25;
const HASHTAGS_MAX_COUNT = 5;
const REG_EXP_SHARP_FIRST = /^#[\s\S]*$/;
const REG_EXP_BODY = /^#[A-Za-zА-Яа-я0-9]*$/;
const REG_EXP_LENGTH = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;

const uploadFile = document.querySelector('#upload-file');
const imgUploadForm = document.querySelector('.img-upload__overlay');
const image = imgUploadForm.querySelector('.img-upload__preview img');

const scaleChanger = imgUploadForm.querySelector('.scale');
const scaleValue = imgUploadForm.querySelector('.scale__control--value');

const changeImgScale = (evt) => {
  const step = evt.target.matches('.scale__control--bigger') ? SCALE_STEP : -SCALE_STEP;
  const border = evt.target.matches('.scale__control--bigger') ? '100%' : '25%';
  if (scaleValue.value !== border) {
    scaleValue.value = `${+scaleValue.value.slice(0, -1) + step}%`;
    image.style.transform = `scale(${+scaleValue.value.slice(0, -1) / 100})`;
    if (scaleValue.value === '100%') {
      image.style.transform = '';
    }
  }
};

scaleChanger.addEventListener('click', changeImgScale);

const formEffects = imgUploadForm.querySelector('.effects');
const sliderElement = imgUploadForm.querySelector('.effect-level__slider');
let effect;


const applyEffect = (evt) => {
  image.classList.remove(`effects__preview--${effect}`);
  effect = evt.target.value;
  if (effect === 'none') {
    return;
  }
  image.classList.add(`effects__preview--${effect}`);

  if (sliderElement.noUiSlider) { sliderElement.noUiSLider.destroy();}
  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
  });
};

formEffects.addEventListener('change', applyEffect);


// Наложение эффекта на изображение:
// Интенсивность эффекта регулируется перемещением ползунка в слайдере. Слайдер реализуется сторонней библиотекой для реализации слайдеров noUiSlider. Уровень эффекта записывается в поле .effect-level__value. При изменении уровня интенсивности эффекта (предоставляется API слайдера), CSS-стили картинки внутри .img-upload__preview обновляются следующим образом:
// Для эффекта «Хром» — filter: grayscale(0..1) с шагом 0.1;
// Для эффекта «Сепия» — filter: sepia(0..1) с шагом 0.1;
// Для эффекта «Марвин» — filter: invert(0..100%) с шагом 1%;
// Для эффекта «Фобос» — filter: blur(0..3px) с шагом 0.1px;
// Для эффекта «Зной» — filter: brightness(1..3) с шагом 0.1;
// Для эффекта «Оригинал» CSS-стили filter удаляются.
// При выборе эффекта «Оригинал» слайдер скрывается.
// При переключении эффектов, уровень насыщенности сбрасывается до начального значения (100%): слайдер, CSS-стиль изображения и значение поля должны обновляться.

const hashtagsInput = imgUploadForm.querySelector('.text__hashtags');
const descriptionInput = imgUploadForm.querySelector('.text__description');

const onPopupEscPress = (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      evt.stopPropagation();
      return;
    }
    closeImgUploadForm();
  }
};

const showImgUploadForm = () => {
  imgUploadForm.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscPress);
};

function closeImgUploadForm() {
  imgUploadForm.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscPress);
  uploadFile.value = '';
  image.style.transform = '';
  image.classList.remove(`effects__preview--${effect}`);
}

const onCloseClick = () => {
  closeImgUploadForm();
};

const closeButton = imgUploadForm.querySelector('.img-upload__cancel');
closeButton.addEventListener('click', onCloseClick);

uploadFile.addEventListener('change', showImgUploadForm);

const validateDescription = () => {
  const valueLength = descriptionInput.value.length;
  const maxLength = descriptionInput.getAttribute('maxlength');
  let customValidityMessage = '';

  if (valueLength > maxLength) {
    customValidityMessage = `Удалите лишние ${  valueLength - maxLength } симв.`;
  }
  descriptionInput.setCustomValidity(customValidityMessage);
};

descriptionInput.addEventListener('input', () => {
  validateDescription();
  descriptionInput.reportValidity();
});

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

hashtagsInput.addEventListener('input', () => {
  validateHashtags();
  hashtagsInput.reportValidity();
});
