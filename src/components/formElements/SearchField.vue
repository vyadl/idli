<script>
import InputCustom from '@/components/formElements/InputCustom.vue';
import ButtonText from '@/components/formElements/ButtonText.vue';

export default {
  components: {
    InputCustom,
    ButtonText,
  },
  data() {
    return {
      searchValue: '',
    };
  },
  methods: {
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
  <div class="search-field">
    <form @submit.prevent="redirectToSearchResults">
      <InputCustom
        v-model="searchValue"
        style-type="unbordered"
        with-additional-element
        placeholder="search in all your lists"
        :is-focus="true"
      />
      <ButtonText
        class="find-button"
        text="find"
        size="smallest"
        type="submit"
        :disabled="!searchValue"
      />
    </form>
  </div>
</template>

<style lang="scss">
.search-field {
  position: relative;
  padding: 7px 10px;
  width: fit-content;
  border: 1px solid map-get($colors, 'gray-light');
  font-size: 12px;

  .find-button {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}
</style>
