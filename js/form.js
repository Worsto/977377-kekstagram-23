const HASHTAGS_MAX_COUNT = 5;
const REG_EXP_SHARP_FIRST = /^#[\s\S]*$/;
const REG_EXP_BODY = /^#[A-Za-zА-Яа-я0-9]*$/;
const REG_EXP_LENGTH = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;

const uploadFile = document.querySelector('#upload-file');
const imgUploadForm = document.querySelector('.img-upload__overlay');
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
}

const onCloseClick = () => {
  closeImgUploadForm();
};

const closeButton = imgUploadForm.querySelector('.img-upload__cancel');
closeButton.addEventListener('click', onCloseClick);

uploadFile.addEventListener('change', showImgUploadForm);

// валидация

descriptionInput.addEventListener('input', () => {
  const valueLength = descriptionInput.value.length;
  const maxLength = descriptionInput.getAttribute('maxlength');
  let customValidityMessage = '';

  if (valueLength > maxLength) {
    customValidityMessage = `Удалите лишние ${  valueLength - maxLength } симв.`;
  }
  descriptionInput.setCustomValidity(customValidityMessage);

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
