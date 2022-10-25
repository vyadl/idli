export default {
  setNotification(state, { text, time }) {
    state.notification = {
      text,
      time: time || null,
    };
  },

  setModalNameToShow(state, name) {
    state.modalNameToShow = name;
  },

  setConfirmationModalTitle(state, title) {
    state.confirmationModalTitle = title;
  },

  increaseExplicitRequestsNumber(state) {
    state.explicitRequestsNumber++;
  },

  decreaseExplicitRequestsNumber(state) {
    state.explicitRequestsNumber--;
  },
};
