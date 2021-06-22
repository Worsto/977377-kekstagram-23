import {createPosts} from './data.js';

const bigPicture = document.querySelector('.big-picture');

const onPopupEscPress = (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
};

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscPress);
}

const showBigPicture = (data) => {
  const img = bigPicture.querySelector('.big-picture__img img');
  img.setAttribute('alt', data.description);
  img.setAttribute('src', data.url);

  bigPicture.querySelector('.social__caption').textContent = data.description;
  bigPicture.querySelector('.likes-count').textContent = data.likes;
  bigPicture.querySelector('.comments-count').textContent = data.comments.length;

  const commentsList = bigPicture.querySelector('.social__comments');
  const commentTemplate = bigPicture.querySelector('.social__comment');
  const commentsListFragment = document.createDocumentFragment();

  const createComment = (commentData) => {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').setAttribute('src', commentData.avatar);
    commentElement.querySelector('.social__text').textContent = commentData.message;
    commentsListFragment.appendChild(commentElement);
  };

  data.comments.forEach((commentData) => {
    createComment(commentData);
  });

  commentsList.innerHTML = '';

  commentsList.appendChild(commentsListFragment);
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onPopupEscPress);
};

const onCloseClick = () => {
  closeBigPicture();
};

const closeButton = bigPicture.querySelector('.big-picture__cancel');
closeButton.addEventListener('click', onCloseClick);

const tempPost = createPosts(1)[0];
showBigPicture(tempPost);
