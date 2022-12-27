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
      '_searchInVault',
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
      button-style-type="loupe"
      position="left"
      stop-propagation
    >
      <form @submit.prevent="redirectToSearchResults">
        <InputCustom
          v-model="searchValue"
          style-type="unbordered"
          with-additional-element
          placeholder="search in all your lists"
        />
        <ButtonText
          class="find-button"
          text="find"
          size="smallest"
          type="submit"
          :disabled="!searchValue"
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
    right: 5px;
    bottom: 5px;
  }
}
</style>
