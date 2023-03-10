<script>
import { mapGetters } from 'vuex';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import VaultSearchField from '@/components/formElements/VaultSearchField.vue';

export default {
  components: {
    PopupBox,
    VaultSearchField,
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
      <VaultSearchField />
    </PopupBox>
  </div>
</template>
