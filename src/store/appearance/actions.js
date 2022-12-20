import { debounce } from 'throttle-debounce';
import { sMedia } from '@/scss/style.module.scss';
import { SCREEN_SIZE_CHECK_DELAY } from '@/store/config';

export default {
  _checkAndSetIsMobileScreen({ getters, commit }) {
    const isMediaMatch = window.matchMedia(JSON.parse(sMedia)).matches;
  
    if (isMediaMatch !== getters.isMobileScreen) {
      commit('setIsMobileScreen', isMediaMatch);
    }
  },

  _debouncedCheckAndSetIsMobileScreen({ dispatch }) {
    return debounce(
      SCREEN_SIZE_CHECK_DELAY,
      dispatch('_checkAndSetIsMobileScreen'),
    );
  },
};
