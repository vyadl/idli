export default {
  isLoggedIn: state => Boolean(state.user.id),
  user: state => state.user,
};
