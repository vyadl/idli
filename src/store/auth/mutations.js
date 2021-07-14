export default {
  logIn(state, user) {
    state.user = user;
  },
  logOut(state) {
    state.user = {
      id: null,
      username: null,
      email: null,
      roles: [],
      accessToken: null,
    };
  },
};
