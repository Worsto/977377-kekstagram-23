import {createPosts} from './data.js';
import {onPopupEscPress} from './utils/esc-press.js';

const bigPicture = document.querySelector('.big-picture');
const page = document.querySelector('body');

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  page.classList.remove('modal-open');
};

const showBigPicture = (data) => {
  const img = bigPicture.querySelector('.big-picture__img img');
  img.setAttribute('alt', data.description);
  img.setAttribute('src', data.url);

  bigPicture.querySelector('.social__caption').textContent = data.description;
  bigPicture.querySelector('.likes-count').textContent = data.likes;
  bigPicture.querySelector('.comments-count').textContent = data.comments.length;

  const commentsList = bigPicture.querySelector('.social__comments');
  const commentTemplate = bigPicture.querySelector('.social__comment');
  const commentsArray = data.comments;
  const commentsListFragment = document.createDocumentFragment();

  const createComment = (commentData) => {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').setAttribute('src', commentData.avatar);
    commentElement.querySelector('.social__text').textContent = commentData.message;
    commentsListFragment.appendChild(commentElement);
  };

  commentsArray.forEach((commentData) => {
    createComment(commentData);
  });

  commentsList.innerHTML = '';

  commentsList.appendChild(commentsListFragment);
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
  page.classList.add('modal-open');

  onPopupEscPress(closeBigPicture);
};

const closeButton = bigPicture.querySelector('.big-picture__cancel');
closeButton.addEventListener('click', closeBigPicture);

const tempPost = createPosts(1)[0];
showBigPicture(tempPost);
