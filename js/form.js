const uploadFile = document.querySelector('#upload-file');
const imgUploadForm = document.querySelector('.img-upload__overlay');

const HASHTAGS_MAX_COUNT = 5;

const hashtagsInput = imgUploadForm.querySelector('.text__hashtags');
const descriptionInput = imgUploadForm.querySelector('.text__description');

const onPopupEscPress = (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
      evt.stopPropagation();
    } else {
      closeImgUploadForm();
    }
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

  if (valueLength > maxLength) {
    descriptionInput.setCustomValidity(`Удалите лишние ${  valueLength - maxLength } симв.`);
  } else {
    descriptionInput.setCustomValidity('');
  }

  descriptionInput.reportValidity();
});

const reSharp = /^#[\s\S]*$/;
const reBody = /^#[A-Za-zА-Яа-я0-9]*$/;
const reLength = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;


const validateHashtags = () => {
  const hashtags = hashtagsInput.value.replace(/^\s+| +(?= )|\s+$/g,'').toLowerCase().split(' ');
  const hashtagsSet = new Set(hashtags);

  if (hashtags.length > HASHTAGS_MAX_COUNT) {
    hashtagsInput.setCustomValidity(`Максимальное количество хэштегов ${HASHTAGS_MAX_COUNT}`);
  } else if (!hashtags.every((elem) => reSharp.test(elem))) {
    hashtagsInput.setCustomValidity('Хэштег может начинаться с символа решетки.');
  } else if (!hashtags.every((elem) => reBody.test(elem))) {
    hashtagsInput.setCustomValidity('Хэштег может содержать только буквы.');
  } else if (hashtags.some((elem) => elem === '#')) {
    hashtagsInput.setCustomValidity('Хэштег не может быть пустым.');
  } else if (!hashtags.every((elem) => reLength.test(elem))) {
    hashtagsInput.setCustomValidity('Хэштег не может быть длиннее 20 символов, включая решетку.');
  } else if (hashtags.length !== hashtagsSet.size) {
    hashtagsInput.setCustomValidity('Хэштег не должен повторяться.');
  } else {
    hashtagsInput.setCustomValidity('');
  }

  // если фокус находится в поле ввода хэш-тега, нажатие на Esc не должно приводить к закрытию формы редактирования изображения.

};

hashtagsInput.addEventListener('input', () => {
  validateHashtags();
  hashtagsInput.reportValidity();
});
