export default {
  isLoggedIn: state => !!state.user.id,
  user: state => state.user,
};
