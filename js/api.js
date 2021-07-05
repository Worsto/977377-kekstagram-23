fetch('https://23.javascript.pages.academy/kekstagram/data')
  .then((response) => response.json())
  .then((json) => {
    console.log('Результат', json);
  });


