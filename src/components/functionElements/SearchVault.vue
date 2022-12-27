<script>
import { mapGetters, mapActions } from 'vuex';
import PopupBox from '@/components/wrappers/PopupBox.vue';
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    PopupBox,
    InputCustom,
    ButtonText,
  },
  data() {
    return {
      searchValue: '',
    };
  },
  computed: {
    ...mapGetters('auth', [
      'isLoggedIn',
    ]),
    ...mapGetters('sidebar', [
      'isSidebarOpen',
      'sidebarMode',
    ]),
  },
  methods: {
    ...mapActions([
      '_searchVault',
    ]),
    redirectToSearchResults() {
      this.$router.push({
        name: 'search', 
        query: { searchValue: this.searchValue },
      });
    },
  },
};
</script>

<template>
  <div
    v-if="isLoggedIn"
    class="search-vault"
  >
    <PopupBox
      popup-style-type="light"
      button-style-type="loupe"
      position="left"
      stop-propagation
    >
      <form @submit.prevent="redirectToSearchResults">
        <InputCustom
          v-model="searchValue"
          with-additional-element
          placeholder="enter full word(s)"
        />
        <ButtonText
          class="find-button"
          text="find"
          style-type="line"
          size="smallest"
          type="submit"
        />
      </form>
    </PopupBox>
  </div>
</template>

<style lang="scss">
.search-vault {
  position: relative;

  .find-button {
    position: absolute;
    right: 7px;
    bottom: 17px;
  }
}
</style>
