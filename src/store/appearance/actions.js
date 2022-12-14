import { debounce } from 'throttle-debounce';
import { sMedia } from '@/scss/style.module.scss';
import { SCREEN_SIZE_CHECK_DELAY } from '@/store/config';

export default {
  _checkAndSetIsMobileScreen({ getters, commit }) {
    const isMatchMedia = window.matchMedia(JSON.parse(sMedia)).matches;
  
    if (isMatchMedia !== getters.isMobileScreen) {
      commit('setIsMobileScreen', isMatchMedia);
    }
  },

  _debouncedCheckAndSetIsMobileScreen({ dispatch }) {
    return debounce(
      SCREEN_SIZE_CHECK_DELAY,
      async () => {
        await dispatch('_checkAndSetIsMobileScreen');
      },
    );
  },
};
