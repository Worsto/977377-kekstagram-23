import {createPosts} from './data.js';

const COMMENTS_PART_COUNT = 5;

const picturesContainer = document.querySelector('.pictures');
const bigPicture = document.querySelector('.big-picture');
const commentsCounter = bigPicture.querySelector('.comments-count');
const commentsLoadedCounter = bigPicture.querySelector('.comments-loaded-count');
const loadButton = bigPicture.querySelector('.comments-loader');
loadButton.classList.add('hidden');

const showBigPicture = (data) => {
  const onPopupEscPress = (evt) => {
    if (evt.key === 'Escape') {
      closeBigPicture();
    }
  };

  const img = bigPicture.querySelector('.big-picture__img img');
  img.setAttribute('alt', data.description);
  img.setAttribute('src', data.url);

  bigPicture.querySelector('.social__caption').textContent = data.description;
  bigPicture.querySelector('.likes-count').textContent = data.likes;
  commentsLoadedCounter.textContent = COMMENTS_PART_COUNT;
  commentsCounter.textContent = data.comments.length;

  const commentsList = bigPicture.querySelector('.social__comments');
  const commentTemplate = commentsList.querySelector('.social__comment');

  let commentsListCount = 0;

  const commentsListFragment = document.createDocumentFragment();

  const createComment = (commentData) => {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').setAttribute('src', commentData.avatar);
    commentElement.querySelector('.social__picture').setAttribute('alt', commentData.name);
    commentElement.querySelector('.social__text').textContent = commentData.message;
    commentsListFragment.appendChild(commentElement);
  };

  if (data.comments.length <= COMMENTS_PART_COUNT) {
    data.comments.forEach((commentData) => createComment(commentData));
    commentsLoadedCounter.textContent = data.comments.length;
  } else {
    for (let i = 0; i < COMMENTS_PART_COUNT; i++) {
      createComment(data.comments[i]);
    }
    loadButton.classList.remove('hidden');
  }

  commentsList.innerHTML = '';
  commentsList.appendChild(commentsListFragment);
  commentsListCount = commentsList.querySelectorAll('li').length;

  const commentsRender = function() {
    commentsListFragment.textContent = '';

    const commentsLeftCount = data.comments.length - commentsListCount;
    const commentsToLoadCount = commentsLeftCount <= COMMENTS_PART_COUNT ? commentsLeftCount : COMMENTS_PART_COUNT;

    for (let i = 0; i < commentsToLoadCount; i++) {
      createComment(data.comments[i + commentsListCount]);
    }
    commentsList.appendChild(commentsListFragment);
    commentsListCount = commentsList.querySelectorAll('li').length;
    commentsLoadedCounter.textContent = commentsListCount;

    if (commentsListCount === data.comments.length) {
      loadButton.classList.add('hidden');
    }
  };

  loadButton.addEventListener('click', commentsRender);

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onPopupEscPress);

  function closeBigPicture() {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onPopupEscPress);
    loadButton.removeEventListener('click', commentsRender);
  }

  const onCloseClick = () => {
    closeBigPicture();
  };

  const closeButton = bigPicture.querySelector('.big-picture__cancel');
  closeButton.addEventListener('click', onCloseClick);
};

picturesContainer.addEventListener('click', (evt) => {
  if (evt.target.matches('.picture__img')) {
    evt.preventDefault();
    showBigPicture(createPosts(25)[+/\d+/.exec(evt.target.id)]);
  }
});
