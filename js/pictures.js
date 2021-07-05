import {createPosts, TEMPORARY_POSTS_COUNT} from './data.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const picturesData = createPosts(TEMPORARY_POSTS_COUNT);

const picturesListFragment = document.createDocumentFragment();

const createPicture = (data) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').setAttribute('id', `picture-${data.id}`);
  pictureElement.querySelector('.picture__img').setAttribute('src', data.url);
  pictureElement.querySelector('.picture__img').setAttribute('alt', data.description);
  pictureElement.querySelector('.picture__likes').textContent = data.likes;
  pictureElement.querySelector('.picture__comments').textContent = data.comments.length;
  picturesListFragment.appendChild(pictureElement);
};

picturesData.forEach((picture) => {
  createPicture(picture);
});

picturesContainer.appendChild(picturesListFragment);
