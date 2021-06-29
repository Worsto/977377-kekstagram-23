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
const effectValue = imgUploadForm.querySelector('.effect-level__value');
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

const applyEffect = (evt) => {
  image.classList.remove(`effects__preview--${effect}`);
  effect = evt.target.value;

  if (sliderElement.noUiSlider && effect !== 'none') {sliderElement.noUiSlider.destroy();}

  if (effect === 'none') {
    sliderElement.noUiSlider.destroy();
    image.style.filter = '';
    return;
  } else {
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
  }
  image.classList.add(`effects__preview--${effect}`);
};

formEffects.addEventListener('change', applyEffect);

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
  image.style.filter = '';
  image.classList.remove(`effects__preview--${effect}`);
  if (sliderElement.noUiSlider && effect !== 'none') {sliderElement.noUiSlider.destroy();}
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
