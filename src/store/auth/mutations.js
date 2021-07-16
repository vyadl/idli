import models from '@/models/models';

export default {
  logIn(state, user) {
    state.user = user;
  },
  logOut(state) {
    state.user = new models.User();
  },
  setRequestStatus(state, status) {
    state.requestStatus = status;
  },
};
