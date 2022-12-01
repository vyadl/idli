export default {
  isLoggedIn: state => !!state.user.id,
  user: state => state.user,
  codeLifetimeInMinutes: state => state.codeLifetimeInMinutes,
};
