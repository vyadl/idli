import models from '@/models/models';

export default {
  signIn(state, user) {
    state.user = user;
  },
  signOut(state) {
    state.user = new models.User();
  },
  startRequestProcessing(state) {
    state.isRequestProcessing = true;
  },
  finishRequestProcessing(state) {
    state.isRequestProcessing = false;
  },
};
