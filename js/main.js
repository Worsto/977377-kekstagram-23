import { getRandomPositiveInteger } from './utils/get-random-positive-integer.js';

const TEMPORARY_POSTS_COUNT = 25;

const TEMPORARY_LIKES_COUNT = {
  min: 15,
  max: 200,
};

const TEMPORARY_AVATAR_NUMBER = {
  min: 1,
  max: 6,
};

const TEMPORARY_DESCRIPTIONS = [
  'Приехали',
  'Послезавтра к зубному',
  'Надо собираться к бабушке, а я не хочу',
  'Почему жизнь так хороша?',
  'Это конечно трындец',
  'С божьей помощью',
  'Когда день не удался',
];

const TEMPORARY_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const TEMPORARY_NAMES = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];

const getRandomArrayElement = (elements) => elements[getRandomPositiveInteger(0, elements.length - 1)];

const createRadomComments = () => {
  const commentsCountMin = 2;
  const commentsCountMax = 8;

  const createComment = (id) => ({
    id: id,
    avatar: `img/avatar-${getRandomPositiveInteger(TEMPORARY_AVATAR_NUMBER.min, TEMPORARY_AVATAR_NUMBER.max)}.svg`,
    message: getRandomArrayElement(TEMPORARY_COMMENTS),
    name: getRandomArrayElement(TEMPORARY_NAMES),
  });

  return new Array(getRandomPositiveInteger(commentsCountMin, commentsCountMax)).fill(null).map((currentValue, index) => createComment(index));
};

const createPost = (id) => ({
  id: id,
  url: `photos/${id + 1}.jpg`,
  description: getRandomArrayElement(TEMPORARY_DESCRIPTIONS),
  likes: getRandomPositiveInteger(TEMPORARY_LIKES_COUNT.min, TEMPORARY_LIKES_COUNT.max),
  comments: createRadomComments(),
});

const posts = new Array(TEMPORARY_POSTS_COUNT).fill(null).map((currentValue, index) => createPost(index));

Window.posts = posts; //заглушка для линтера
