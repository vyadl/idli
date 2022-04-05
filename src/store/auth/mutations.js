import { User } from '@/models/models';

export default {
  signIn(state, user) {
    state.user = user;
  },
  logOut(state) {
    state.user = new User();
  },
};
