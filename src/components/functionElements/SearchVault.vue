<script>
import { mapGetters } from 'vuex';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import SearchField from '@/components/formElements/SearchField.vue';

export default {
  components: {
    PopupBox,
    SearchField,
  },
  computed: {
    ...mapGetters('appearance', [
      'isMobileScreen',
    ]),
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
  },
};
</script>

<template>
  <div
    v-if="isLoggedIn"
    class="search-vault"
  >
    <PopupBox
      button-style-type="loupe"
      popup-style-type="plain"
      :position="isMobileScreen ? 'upper-right' : 'left'"
      stop-propagation
    >
      <SearchField />
    </PopupBox>
  </div>
</template>
