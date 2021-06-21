export const onPopupEscPress = (closeFunc) => {
  function escapeEvent(evt) {
    if (evt.key === 'Escape') {
      closeFunc();
      document.removeEventListener('keydown', escapeEvent);
    }
  }
  document.addEventListener('keydown', escapeEvent);
};
