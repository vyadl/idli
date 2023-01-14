import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('settings', {
      globalTheme: 'theme',
    }),
  },
};
