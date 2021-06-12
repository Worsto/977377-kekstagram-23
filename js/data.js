import { getRandomPositiveInteger } from './utils/get-random-positive-integer.js';
import { getRandomArrayElement } from './utils/get-random-array-element.js';

export const TEMPORARY_POSTS_COUNT = 25;

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

const temporaryLikesCount = {
  min: 15,
  max: 200,
};

const temporaryCommentsCount = {
  min: 2,
  max: 8,
};

const createCommentMessage = () => {
  let string = getRandomArrayElement(TEMPORARY_COMMENTS);
  const text = getRandomArrayElement(TEMPORARY_COMMENTS);
  if (text !== string) {
    string = `${string} ${text}`;
  }
  return string;
};

const createRadomComments = () => {
  const createComment = (id) => ({
    id: id,
    avatar: `img/avatar-${getRandomPositiveInteger(TEMPORARY_AVATAR_NUMBER.min, TEMPORARY_AVATAR_NUMBER.max)}.svg`,
    message: createCommentMessage(),
    name: getRandomArrayElement(TEMPORARY_NAMES),
  });

  return new Array(getRandomPositiveInteger(temporaryCommentsCount.min, temporaryCommentsCount.max)).fill(null).map((currentValue, index) => createComment(index));
};

const createPost = (id) => ({
  id: id,
  url: `photos/${id + 1}.jpg`,
  description: getRandomArrayElement(TEMPORARY_DESCRIPTIONS),
  likes: getRandomPositiveInteger(temporaryLikesCount.min, temporaryLikesCount.max),
  comments: createRadomComments(),
});

export const createPosts = (count) => new Array(count).fill(null).map((currentValue, index) => createPost(index));
