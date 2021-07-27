export default {
  isLoggedIn: state => Boolean(state.user.id),
  username: state => state.user.username,
  isRequestProcessing: state => state.isRequestProcessing,
};
