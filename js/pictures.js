const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

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

const renderPictures = (data) => {
  data.forEach((picture) => {
    createPicture(picture);
  });
  picturesContainer.appendChild(picturesListFragment);
};

export {renderPictures};
